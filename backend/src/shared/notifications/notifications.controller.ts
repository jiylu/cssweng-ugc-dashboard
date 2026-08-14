import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FindNotificationsQueryDTO } from './dto/find-notifications-query.dto';
import {
  ApiFindNotification,
  ApiFindNotificationsForUser,
  ApiMarkNotificationAsRead,
} from './docs/notifications.controller.swagger';
import { plainToInstance } from 'class-transformer';
import { NotificationsEntity } from './entities/notifications.entity';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiFindNotification()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const notificationId =
      await this.notificationsService.resolvePublicId(publicId);
    const notification =
      await this.notificationsService.findNotification(notificationId);

    return plainToInstance(NotificationsEntity, notification);
  }

  @ApiFindNotificationsForUser()
  @Get()
  async findMany(@Query() query: FindNotificationsQueryDTO) {
    const notifications =
      await this.notificationsService.findNotificationsForUser(query);

    return plainToInstance(NotificationsEntity, notifications);
  }

  @ApiMarkNotificationAsRead()
  @Post('read-notification/:publicId')
  async markRead(@Param('publicId') publicId: string) {
    const notificationId =
      await this.notificationsService.resolvePublicId(publicId);
    const notification =
      await this.notificationsService.markAsRead(notificationId);

    return plainToInstance(NotificationsEntity, notification);
  }
}
