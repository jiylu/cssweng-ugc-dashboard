import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/features/users/users.service';
import { NotificationsService } from '../notifications.service';
import { CreateNotificationDTO } from '../dto/create-notification.dto';
import { FindNotificationsQueryDTO } from '../dto/find-notifications-query.dto';

describe('NotificationsService', () => {
  let service: NotificationsService;

  const mockPrisma = {
    notifications: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUserService = {
    getActiveUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserService, useValue: mockUserService },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createNotification', () => {
    it('should create and return a notification', async () => {
      const dto: CreateNotificationDTO = {
        userId: 'user-1',
        title: 'Proposal Received',
        message: 'You have a new proposal.',
      };

      const mockNotification = {
        notification_id: 'notif-1',
        user_id: dto.userId,
        title: dto.title,
        message: dto.message,
        is_read: false,
        created_at: new Date(),
      };

      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: dto.userId,
      });
      mockPrisma.notifications.create.mockResolvedValue(mockNotification);

      const result = await service.createNotification(dto);

      expect(result).toEqual(mockNotification);
      expect(mockUserService.getActiveUserById).toHaveBeenCalledWith(
        dto.userId,
      );
      expect(mockPrisma.notifications.create).toHaveBeenCalledWith({
        data: {
          user_id: dto.userId,
          title: dto.title,
          message: dto.message,
        },
      });
    });

    it('should propagate user lookup errors', async () => {
      const dto: CreateNotificationDTO = {
        userId: 'missing-user',
        title: 'Title',
        message: 'Message',
      };

      mockUserService.getActiveUserById.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(service.createNotification(dto)).rejects.toThrow(
        'User not found',
      );
      expect(mockPrisma.notifications.create).not.toHaveBeenCalled();
    });
  });

  describe('findNotification', () => {
    it('should return notification when found', async () => {
      const mockNotification = {
        notification_id: 'notif-1',
        user_id: 'user-1',
        title: 'Proposal Received',
        message: 'You have a new proposal.',
        is_read: false,
      };

      mockPrisma.notifications.findFirst.mockResolvedValue(mockNotification);

      const result = await service.findNotification('notif-1');

      expect(result).toEqual(mockNotification);
      expect(mockPrisma.notifications.findFirst).toHaveBeenCalledWith({
        where: { notification_id: 'notif-1' },
      });
    });

    it('should throw NotFoundException when not found', async () => {
      mockPrisma.notifications.findFirst.mockResolvedValue(null);

      await expect(service.findNotification('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findNotificationsForUser', () => {
    it('should return notifications ordered by created_at desc without limit', async () => {
      const query: FindNotificationsQueryDTO = { userId: 'user-1' };
      const mockUser = { user_id: 'user-1' };
      const mockNotifications = [
        { notification_id: 'notif-2' },
        { notification_id: 'notif-1' },
      ];

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.notifications.findMany.mockResolvedValue(mockNotifications);

      const result = await service.findNotificationsForUser(query);

      expect(result).toEqual(mockNotifications);
      expect(mockPrisma.notifications.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUser.user_id },
        orderBy: { created_at: 'desc' },
      });
    });

    it('should apply limit when provided', async () => {
      const query: FindNotificationsQueryDTO = { userId: 'user-1', limit: 5 };
      const mockUser = { user_id: 'user-1' };

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.notifications.findMany.mockResolvedValue([]);

      await service.findNotificationsForUser(query);

      expect(mockPrisma.notifications.findMany).toHaveBeenCalledWith({
        where: { user_id: mockUser.user_id },
        take: 5,
        orderBy: { created_at: 'desc' },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const existing = {
        notification_id: 'notif-1',
        user_id: 'user-1',
        is_read: false,
      };
      const updated = { ...existing, is_read: true };

      mockPrisma.notifications.findFirst.mockResolvedValue(existing);
      mockPrisma.notifications.update.mockResolvedValue(updated);

      const result = await service.markAsRead('notif-1');

      expect(result).toEqual(updated);
      expect(mockPrisma.notifications.update).toHaveBeenCalledWith({
        where: { notification_id: 'notif-1' },
        data: { is_read: true },
      });
    });

    it('should throw ConflictException if notification is already read', async () => {
      mockPrisma.notifications.findFirst.mockResolvedValue({
        notification_id: 'notif-1',
        is_read: true,
      });

      await expect(service.markAsRead('notif-1')).rejects.toThrow(
        ConflictException,
      );
      expect(mockPrisma.notifications.update).not.toHaveBeenCalled();
    });
  });
});
