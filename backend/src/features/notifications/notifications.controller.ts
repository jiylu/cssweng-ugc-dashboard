import { Controller, Get, Param, Post, Query } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FindNotificationsQueryDTO } from './dto/find-notifications-query.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get(':notificationId')
  findOne(@Param('notificationId') notificationId: string) {
    return this.notificationsService.findNotification(notificationId);
  }

  @Get()
  findMany(@Query() query: FindNotificationsQueryDTO) {
    return this.notificationsService.findNotificationsForUser(query);
  }

  @Post('read-notification/:notificationId')
  markRead(@Param('notificationId') notificationId: string) {
    return this.notificationsService.markAsRead(notificationId);
  }
}
