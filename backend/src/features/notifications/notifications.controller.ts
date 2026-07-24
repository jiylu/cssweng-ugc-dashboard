import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FindNotificationsQueryDTO } from './dto/find-notifications-query.dto';
import {
  ApiFindNotification,
  ApiFindNotificationsForUser,
  ApiMarkNotificationAsRead,
} from './docs/notifications.controller.swagger';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiFindNotification()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const notificationId =
      await this.notificationsService.resolvePublicId(publicId);
    return this.notificationsService.findNotification(notificationId);
  }

  @ApiFindNotificationsForUser()
  @Get()
  findMany(@Query() query: FindNotificationsQueryDTO) {
    return this.notificationsService.findNotificationsForUser(query);
  }

  @ApiMarkNotificationAsRead()
  @Post('read-notification/:notificationId')
  markRead(@Param('notificationId') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }
}
