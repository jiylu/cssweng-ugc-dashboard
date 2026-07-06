import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async createActivityLog(dto: CreateActivityLogDto) {
    return this.prisma.activityLog.create({
      data: {
        user_id: dto.userId,
        entity_type: dto.entityType,
        entity_id: dto.entityId,
        action: dto.action,
        created_at: new Date(),
      },
    });
  }

  async getLogsByUser(userId: string) {
    return this.prisma.activityLog.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
      },
    });
  }

  // async markAsRead(log_id: string) {
  //   return this.prisma.activityLog.update({
  //     where: { log_id },
  //     data: { is_read: true },
  //   });
  // }

  // async markAllAsRead(user_id: string) {
  //   return this.prisma.activityLog.updateMany({
  //     where: { user_id, is_read: false },
  //     data: { is_read: true },
  //   });
  // }

  // async getUnreadCount(user_id: string) {
  //   return this.prisma.activityLog.count({
  //     where: { user_id, is_read: false },
  //   });
  // }
}
