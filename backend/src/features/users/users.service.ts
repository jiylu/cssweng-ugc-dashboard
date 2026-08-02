import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthError, User } from '@supabase/supabase-js';
import { OtpService } from '../otp/otp.service';
import { CreateUserTransactionDTO } from './dto/create-user-transaction.dto';
import { UserRoles } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private otpService: OtpService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(dto: CreateUserTransactionDTO) {
    const userDTO = dto.userDTO;
    this.logger.debug(`Creating new ${userDTO.role} user ${userDTO.email}`);

    const email = await this.validateEmail(userDTO.email);

    await this.otpService.consumeVerification(
      email,
      userDTO.role,
      userDTO.verificationToken,
    );

    const { data: authData, error } = await this.supabase.client.auth.signUp({
      email,
      password: userDTO.password,
      options: {
        data: {
          firstName: userDTO.firstName,
          lastName: userDTO.lastName,
          role: userDTO.role,
        },
      },
    });
    this.handleSupabaseUserCreationErrors(email, error, authData.user);

    const newUser = await this.prisma.user.create({
      data: {
        user_id: authData.user.id,
        email,
        first_name: userDTO.firstName,
        last_name: userDTO.lastName,
        role: userDTO.role,
      },
    });

    if (userDTO.role === UserRoles.CLIENT) {
      const clientDTO = dto.clientDTO;
      if (!clientDTO) {
        throw new BadRequestException({
          code: 'CLIENT_DETAILS_NOT_FILLED',
          message: 'Client details not filled up.',
        });
      }
      await this.prisma.clients.create({
        data: {
          user_id: newUser.user_id,
          company_legal_name: clientDTO.companyLegalName,
          company_email: clientDTO.companyEmail,
          billable_person: clientDTO.billablePerson,
          contact_person: clientDTO.contactPerson,
          company_contact_no: clientDTO.companyContactNumber,
          contact_person_contact_no: clientDTO.contactPersonContactNumber,
        },
      });
    }

    this.logger.log(
      `Created new user with email: ${newUser.email} id: ${newUser.user_id}`,
    );

    return newUser;
  }

  async validateEmail(email: string) {
    const safeEmail = email.trim().toLowerCase();
    const existingUser = await this.findActiveUserByEmail(email);

    if (existingUser) {
      this.logger.warn(`Email ${email} already exists in the database.`);

      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    return safeEmail;
  }

  private handleSupabaseUserCreationErrors(
    email: string,
    error: AuthError | null,
    user: User | null,
  ): asserts user is User {
    if (error) {
      const isExistingUser = error.message
        .toLowerCase()
        .includes('already registered');

      this.logger.warn(`Failed to create user ${email}`);

      throw new (isExistingUser ? ConflictException : BadRequestException)({
        status: isExistingUser ? HttpStatus.CONFLICT : HttpStatus.BAD_REQUEST,
        code: isExistingUser
          ? 'AUTH_EMAIL_ALREADY_EXISTS'
          : 'AUTH_SIGNUP_ERROR',
        message: error.message,
      });
    }

    if (!user) {
      this.logger.warn(`Failed to create user ${email}`);

      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'AUTH_USER_NOT_CREATED',
        message: 'Unable to create auth user',
      });
    }
  }

  async login(dto: LoginUserDTO) {
    this.logger.debug(`Attempting login for ${dto.email}`);

    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user || !data.session) {
      this.logger.debug(`Failed login for ${dto.email}`);
      throw new UnauthorizedException({
        code: 'INVALID_LOGIN',
        message: error?.message ?? 'Invalid email or password',
      });
    }

    const user = await this.getActiveUserById(data.user.id);
    this.logger.debug(`Successful login for ${dto.email}`);

    return {
      user,
      session: data.session,
    };
  }

  async findActiveUserByEmail(email: string) {
    this.logger.debug(`Finding active user with email ${email}`);

    const activeUser = await this.prisma.user.findFirst({
      where: {
        email: email,
        is_active: true,
      },
    });

    if (!activeUser) {
      this.logger.debug(`No active user found with email ${email}`);
      return null;
    }

    this.logger.debug(
      `Active user found with email ${email}, id: ${activeUser.user_id}`,
    );

    return activeUser;
  }

  async getActiveUserByEmail(email: string) {
    this.logger.debug(`Getting active user with email ${email}`);
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        is_active: true,
      },
    });

    if (!user) {
      this.logger.debug(`No active user found with email ${email}`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    this.logger.debug(
      `Active user found with email ${email}, id: ${user.user_id}.`,
    );
    return user;
  }

  async findActiveUserById(userId: string) {
    this.logger.debug(`Finding active user ${userId}`);

    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });

    if (!user) {
      this.logger.debug(`No active user with id ${userId} found.`);
      return null;
    }

    this.logger.debug(`Active user with id ${user.user_id} found.`);
    return user;
  }

  async getActiveUserById(userId: string) {
    this.logger.debug(`Getting active user ${userId}`);

    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });

    if (!user) {
      this.logger.debug(`No active user with id ${userId} found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    this.logger.debug(`Active user with id ${user.user_id} found.`);
    return user;
  }

  async updateById(userId: string, dto: UpdateUserDTO) {
    this.logger.debug(`Updating user ${userId}`);

    await this.getActiveUserById(userId);

    const updated = await this.prisma.user.update({
      where: { user_id: userId },
      data: {
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
      },
    });

    this.logger.log(`User ${userId} updated successfully`);
    return updated;
  }

  async deactivateById(userId: string) {
    this.logger.debug(`Deactivating user ${userId}`);

    await this.getActiveUserById(userId);

    const updated = await this.prisma.user.update({
      where: { user_id: userId },
      data: { is_active: false },
    });

    this.logger.log(`User ${userId} deactivated`);
    return updated;
  }
}
