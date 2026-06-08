import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { LoginUserDTO } from './dto/login-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const exisingUser = await this.findActiveUserByEmail(dto.email);

    if (exisingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    const { data: authData, error } = await this.supabase.client.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          role: dto.role,
        },
      },
    });

    if (error) {
      const isExistingUser = error.message
        .toLowerCase()
        .includes('already registered');

      throw new (isExistingUser ? ConflictException : BadRequestException)({
        code: isExistingUser
          ? 'AUTH_EMAIL_ALREADY_EXISTS'
          : 'AUTH_SIGNUP_ERROR',
        message: error.message,
      });
    }

    if (!authData.user) {
      throw new BadRequestException({
        code: 'AUTH_USER_NOT_CREATED',
        message: 'Unable to create auth user',
      });
    }

    return this.prisma.user.create({
      data: {
        user_id: authData.user.id,
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: dto.role,
      },
    });
  }

  async login(dto: LoginUserDTO) {
    const { data, error } = await this.supabase.client.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException({
        code: 'INVALID_LOGIN',
        message: error?.message ?? 'Invalid email or password',
      });
    }

    const user = await this.getActiveUserById(data.user.id);

    return {
      user,
      session: data.session,
    };
  }

  async getUserFromAccessToken(accessToken: string) {
    const { data, error } = await this.supabase.client.auth.getUser(
      accessToken,
    );

    if (error || !data.user) {
      throw new UnauthorizedException({
        code: 'INVALID_SESSION',
        message: error?.message ?? 'Invalid session',
      });
    }

    return this.getActiveUserById(data.user.id);
  }

  async refreshSession(refreshToken: string) {
    const { data, error } = await this.supabase.client.auth.refreshSession({
      refresh_token: refreshToken,
    });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException({
        code: 'SESSION_REFRESH_FAILED',
        message: error?.message ?? 'Unable to refresh session',
      });
    }

    const user = await this.getActiveUserById(data.user.id);

    return {
      user,
      session: data.session,
    };
  }

  async findActiveUserByEmail(email: string) {
    return await this.prisma.user.findFirst({
      where: {
        email: email,
        is_active: true,
      },
    });
  }

  async getActiveUserByEmail(email: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: email,
        is_active: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  }

  async findActiveUserById(userId: string) {
    return await this.prisma.user.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });
  }

  async getActiveUserById(userId: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        user_id: userId,
        is_active: true,
      },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }

    return user;
  }

  async updateById(userId: string, dto: UpdateUserDTO) {
    await this.getActiveUserById(userId);

    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
      },
    });
  }

  async deactivateById(userId: string) {
    await this.getActiveUserById(userId);

    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        is_active: false,
      },
    });
  }
}
