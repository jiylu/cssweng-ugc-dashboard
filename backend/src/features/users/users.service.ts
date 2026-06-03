import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
//import { SupabaseService } from 'src/supabase/supabase.service';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    //private supabase: SupabaseService,
  ) {}

  async createUser(dto: CreateUserDTO) {
    const exisingUser = await this.findActiveUserByEmail(dto.email);

    if (exisingUser) {
      throw new ConflictException({
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already exists',
      });
    }

    return this.prisma.user.create({
      data: {
        user_id: dto.userId,
        email: dto.email,
        first_name: dto.firstName,
        last_name: dto.lastName,
        role: dto.role,
      },
    });
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
