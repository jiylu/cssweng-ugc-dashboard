import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private supabase: SupabaseService,
  ) {}
  async createUser(dto: CreateUserDTO) {
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

  async findActiveUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        user_id: userId,
        is_active: true,
      },
    });
  }

  async updateById(userId: string, dto: UpdateUserDTO) {
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
    return this.prisma.user.update({
      where: { user_id: userId },
      data: {
        is_active: false,
      },
    });
  }
}
