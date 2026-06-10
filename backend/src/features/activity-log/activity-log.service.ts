import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { EntityType, Action, DeliverableType } from '@prisma/client';
import { CreateActivityLogDto } from './dto/create-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(private prisma: PrismaService) {}

  async createActivityLog(dto: CreateActivityLogDto) {
  return this.prisma.activityLog.create({
    data: {
      user_id: dto.userId,
      target_user_id: dto.targetUserId,
      entity_type: dto.entityType,
      entity_id: dto.entityId,
      action: dto.action,
      title: dto.title,
      message: dto.message,
      is_read: dto.isRead,
      created_at: new Date(),
    },
  });
  }

  async getLogsByUser(user_id: string) {
    return this.prisma.activityLog.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
        target_user: true,
      },
    });
  }

  async getLogsTargetingUser(target_user_id: string) {
    return this.prisma.activityLog.findMany({
      where: { target_user_id },
      orderBy: { created_at: 'desc' },
      include: {
        user: true,
        target_user: true,
      },
    });
  }

  async markAsRead(log_id: string) {
    return this.prisma.activityLog.update({
      where: { log_id },
      data: { is_read: true },
    });
  }

  async markAllAsRead(user_id: string) {
    return this.prisma.activityLog.updateMany({
      where: { user_id, is_read: false },
      data: { is_read: true },
    });
  }

  async getUnreadCount(user_id: string) {
    return this.prisma.activityLog.count({
      where: { user_id, is_read: false },
    });
  }
}