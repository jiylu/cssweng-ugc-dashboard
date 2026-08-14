import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UpdateUserDTO } from './dto/update-user.dto';
import { SupabaseService } from 'src/shared/supabase/supabase.service';
import { LoginUserDTO } from './dto/login-user.dto';
import { AuthError, User } from '@supabase/supabase-js';
import { OtpService } from '../otp/otp.service';
import { CreateUserTransactionDTO } from './dto/create-user-transaction.dto';
import { UserRoles } from '@prisma/client';
import { UpdateOwnProfileDTO } from './dto/update-own-profile.dto';
import { ForgotPasswordDTO } from './dto/forgot-password.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { EmailService } from '../../../shared/email/email.service';
import { UpdateUserSettingsDTO } from './dto/update-user-settings.dto';
import { ChangePasswordDTO } from './dto/change-password.dto';

@Injectable()
export class UserService {
  static readonly DEFAULT_PROFILE_PICTURE_URL =
    'https://www.clipartmax.com/png/full/449-4492509_lefroy-ice-breakers-minor-hockey-tournament-sorry-no-image-available.png';
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
    private otpService: OtpService,
    private emailService: EmailService,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async createUser(dto: CreateUserTransactionDTO) {
    const userDTO = dto.userDTO;
    this.logger.debug(`Creating new ${userDTO.role} user ${userDTO.email}`);

    if (userDTO.role === UserRoles.CLIENT && !dto.clientDTO) {
      throw new BadRequestException({
        code: 'CLIENT_DETAILS_NOT_FILLED',
        message: 'Client details not filled up.',
      });
    }

    const email = userDTO.email.trim().toLowerCase();
    const existingUser = await this.findActiveUserByEmail(email);

    if (existingUser) {
      const canRecoverIncompleteClient =
        userDTO.role === UserRoles.CLIENT &&
        existingUser.role === UserRoles.CLIENT &&
        !(await this.prisma.clients.findUnique({
          where: { user_id: existingUser.user_id },
        }));

      if (!canRecoverIncompleteClient) {
        this.logger.warn(`Email ${email} already exists in the database.`);
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
        });
      }

      await this.otpService.consumeVerification(
        email,
        userDTO.role,
        userDTO.verificationToken,
      );
      await this.createClient(existingUser.user_id, dto.clientDTO!);

      this.logger.log(
        `Completed client profile for user ${existingUser.user_id}`,
      );
      return existingUser;
    }

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
      await this.createClient(newUser.user_id, dto.clientDTO!);
    }

    this.logger.log(
      `Created new user with email: ${newUser.email} id: ${newUser.user_id}`,
    );

    return newUser;
  }

  private createClient(
    userId: string,
    clientDTO: NonNullable<CreateUserTransactionDTO['clientDTO']>,
  ) {
    return this.prisma.clients.create({
      data: {
        user_id: userId,
        company_legal_name: clientDTO.companyLegalName,
        company_email: clientDTO.companyEmail,
        billable_person: clientDTO.billablePerson,
        contact_person: clientDTO.contactPerson,
        company_contact_no: clientDTO.companyContactNumber,
        contact_person_contact_no: clientDTO.contactPersonContactNumber,
      },
    });
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

      this.logger.warn(
        `Failed to create auth user ${email}: ${error.message}` +
          (error.code ? ` (code: ${error.code})` : '') +
          (error.status ? ` (status: ${error.status})` : ''),
      );

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

    if (user.two_factor_enabled) {
      if (!dto.otp) {
        await this.otpService.createLogin(user.email, user.role);
        return { requiresTwoFactor: true as const };
      }

      await this.otpService.validateLogin(user.email, user.role, dto.otp);
    }

    this.logger.debug(`Successful login for ${dto.email}`);

    return {
      user,
      session: data.session,
      requiresTwoFactor: false as const,
    };
  }

  async getSettings(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { user_id: userId },
      select: {
        two_factor_enabled: true,
        email_proposal_updates: true,
        email_contract_updates: true,
        email_deliverable_updates: true,
        email_payment_updates: true,
      },
    });
  }

  async updateSettings(userId: string, dto: UpdateUserSettingsDTO) {
    await this.getActiveUserById(userId);
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        two_factor_enabled: dto.twoFactorEnabled,
        email_proposal_updates: dto.emailProposalUpdates,
        email_contract_updates: dto.emailContractUpdates,
        email_deliverable_updates: dto.emailDeliverableUpdates,
        email_payment_updates: dto.emailPaymentUpdates,
      },
      select: {
        two_factor_enabled: true,
        email_proposal_updates: true,
        email_contract_updates: true,
        email_deliverable_updates: true,
        email_payment_updates: true,
      },
    });
  }

  async requestPasswordReset(dto: ForgotPasswordDTO) {
    const redirectTo = `${process.env.FRONTEND_URL ?? 'http://localhost:3000'}/reset-password`;
    const email = dto.email.trim().toLowerCase();
    const { data, error } =
      await this.supabase.adminClient.auth.admin.generateLink({
        type: 'recovery',
        email,
        options: { redirectTo },
      });

    if (error) {
      this.logger.warn(`Password recovery request failed: ${error.message}`);
    } else if (data.properties?.action_link) {
      await this.emailService.sendPasswordResetEmail(
        email,
        data.properties.action_link,
      );
    }

    return {
      message:
        'If an account exists for that email, a reset link has been sent.',
    };
  }

  async resetPassword(dto: ResetPasswordDTO) {
    const { data, error: tokenError } = await this.supabase.client.auth.getUser(
      dto.accessToken,
    );

    if (tokenError || !data.user) {
      throw new UnauthorizedException({
        code: 'INVALID_RECOVERY_TOKEN',
        message: 'This password reset link is invalid or has expired.',
      });
    }

    const { error } = await this.supabase.adminClient.auth.admin.updateUserById(
      data.user.id,
      {
        password: dto.password,
      },
    );

    if (error) {
      throw new BadRequestException({
        code: 'PASSWORD_RESET_FAILED',
        message: error.message,
      });
    }

    return { message: 'Password updated successfully.' };
  }

  async changePassword(
    userId: string,
    email: string,
    dto: ChangePasswordDTO,
  ) {
    const { error: verificationError } =
      await this.supabase.client.auth.signInWithPassword({
        email,
        password: dto.currentPassword,
      });

    if (verificationError) {
      throw new UnauthorizedException({
        code: 'INVALID_CURRENT_PASSWORD',
        message: 'Current password is incorrect.',
      });
    }

    const { error } =
      await this.supabase.adminClient.auth.admin.updateUserById(userId, {
        password: dto.newPassword,
      });

    if (error) {
      throw new BadRequestException({
        code: 'PASSWORD_CHANGE_FAILED',
        message: error.message,
      });
    }

    return { message: 'Password changed successfully.' };
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

  async updateOwnProfile(userId: string, dto: UpdateOwnProfileDTO) {
    const currentUser = await this.getActiveUserById(userId);
    const email = dto.email.trim().toLowerCase();
    const normalizeName = (value: string) =>
      value
        .replace(/[^\p{L}\p{M}'’\-\s]/gu, '')
        .replace(/\s+/g, ' ')
        .trim();

    if (email !== currentUser.email) {
      const existingUser = await this.findActiveUserByEmail(email);
      if (existingUser && existingUser.user_id !== userId) {
        throw new ConflictException({
          code: 'EMAIL_ALREADY_EXISTS',
          message: 'Email already exists',
        });
      }

      const { error } =
        await this.supabase.adminClient.auth.admin.updateUserById(userId, {
          email,
          email_confirm: true,
        });
      if (error) {
        throw new BadRequestException({
          code: 'AUTH_EMAIL_UPDATE_FAILED',
          message: error.message,
        });
      }
    }

    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        email,
        first_name: normalizeName(dto.firstName),
        last_name: normalizeName(dto.lastName),
        middle_name:
          dto.middleName === undefined
            ? undefined
            : dto.middleName.trim()
              ? normalizeName(dto.middleName)
              : null,
        display_name:
          dto.displayName === undefined
            ? undefined
            : dto.displayName.trim() || "",
        primary_handle:
          dto.primaryHandle === undefined
            ? undefined
            : dto.primaryHandle.trim() || "",
        phone_number:
          dto.phoneNumber === undefined ? undefined : dto.phoneNumber || "",
        timezone: dto.timezone,
      },
    });
  }

  async updateProfilePicture(userId: string, profilePictureUrl: string) {
    await this.getActiveUserById(userId);

    return this.prisma.user.update({
      where: { user_id: userId },
      data: { profile_picture_url: profilePictureUrl },
    });
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
