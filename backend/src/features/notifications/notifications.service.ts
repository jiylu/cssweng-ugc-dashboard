import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from '../users/users.service';
import { CreateNotificationDTO } from './dto/create-notification.dto';
import { FindNotificationsQueryDTO } from './dto/find-notifications-query.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createNotification(dto: CreateNotificationDTO) {
    this.logger.debug(`Creating notification for ${dto.userId}`);

    await this.userService.getActiveUserById(dto.userId);

    const publicId = nanoid(10);

    const notification = await this.prisma.notifications.create({
      data: {
        user_id: dto.userId,
        public_id: publicId,
        title: dto.title,
        message: dto.message,
      },
    });

    this.logger.log(
      `Created notification with title ${notification.title} for ${notification.user_id}`,
    );

    return notification;
  }

  async resolvePublicId(publicId: string) {
    this.logger.debug(`Resolving publicId: ${publicId}`);

    const notification = await this.prisma.notifications.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        notification_id: true,
      },
    });

    if (!notification) {
      this.logger.warn(`Public id ${publicId} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'NOTIF_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'Notification Public ID cannot be resolved.',
      });
    }

    return notification.notification_id;
  }

  async findNotification(notificationId: string) {
    this.logger.debug(`Finding notification ${notificationId}`);

    const notification = await this.prisma.notifications.findFirst({
      where: {
        notification_id: notificationId,
      },
    });

    if (!notification) {
      this.logger.warn(`Notification ${notification} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'NOTIFICATION_NOT_FOUND',
        message: 'Notification not found',
      });
    }

    this.logger.log(
      `Found notification ${notification.notification_id} with title ${notification.title}`,
    );

    return notification;
  }

  async findNotificationsForUser(query: FindNotificationsQueryDTO) {
    this.logger.debug(`Finding notifications for user ${query.userId}`);

    const user = await this.userService.getActiveUserById(query.userId);

    const notifications = await this.prisma.notifications.findMany({
      where: {
        user_id: user.user_id,
      },
      ...(query.limit ? { take: query.limit } : {}),
      orderBy: { created_at: 'desc' },
    });

    this.logger.log(
      `Found ${notifications.length} notifications for user ${user.user_id}`,
    );

    return notifications;
  }

  async markAsRead(notificationId: string) {
    this.logger.debug(`Marking notification ${notificationId} as read`);

    const notification = await this.findNotification(notificationId);

    if (notification.is_read) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'NOTIFICATION_ALREADY_READ',
        message: 'Notification is already read',
      });
    }

    const updatedNotification = await this.prisma.notifications.update({
      where: { notification_id: notification.notification_id },
      data: {
        is_read: true,
      },
    });

    this.logger.debug(
      `Marked notification ${notification.notification_id} as read`,
    );

    return updatedNotification;
  }
}
