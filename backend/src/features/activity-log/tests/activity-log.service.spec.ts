import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogService } from '../activity-log.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { EntityType, Action, DeliverableType } from '@prisma/client';

describe('ActivityLogService', () => {
  let service: ActivityLogService;

  const mockPrisma = {
    activityLog: {
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActivityLogService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ActivityLogService>(ActivityLogService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createActivityLog', () => {
    it('should create and return an activity log', async () => {
      const dto: CreateActivityLogDto = {
        userId: 'user-1',
        targetUserId: 'user-2',
        entityType: EntityType.CAMPAIGN,
        entityId: 'camp-1',
        action: Action.SUBMISSION,
        title: DeliverableType.UGC,
        message: 'User submitted a campaign',
        isRead: false,
      };

      const mockLog = {
        log_id: 'log-1',
        ...dto,
        created_at: new Date(),
      };

      mockPrisma.activityLog.create.mockResolvedValue(mockLog);

      const result = await service.createActivityLog(dto);

      expect(result).toEqual(mockLog);
      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          user_id: dto.userId,
          target_user_id: dto.targetUserId,
          entity_type: dto.entityType,
          entity_id: dto.entityId,
          action: dto.action,
          title: dto.title,
          message: dto.message,
          is_read: dto.isRead,
          created_at: expect.any(Date),
        },
      });
    });

    it('should propagate errors from prisma', async () => {
      const dto: CreateActivityLogDto = {
        userId: 'user-1',
        targetUserId: 'user-2',
        entityType: EntityType.CAMPAIGN,
        entityId: 'camp-1',
        action: Action.SUBMISSION,
        title: DeliverableType.UGC,
        message: 'User submitted a campaign',
        isRead: false,
      };

      mockPrisma.activityLog.create.mockRejectedValue(new Error('DB error'));

      await expect(service.createActivityLog(dto)).rejects.toThrow('DB error');
    });
  });

  describe('getLogsByUser', () => {
    it('should return logs for a user ordered by date', async () => {
      const mockLogs = [
        { log_id: 'log-1', user_id: 'user-1', created_at: new Date() },
        { log_id: 'log-2', user_id: 'user-1', created_at: new Date() },
      ];

      mockPrisma.activityLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getLogsByUser('user-1');

      expect(result).toEqual(mockLogs);
      expect(mockPrisma.activityLog.findMany).toHaveBeenCalledWith({
        where: { user_id: 'user-1' },
        orderBy: { created_at: 'desc' },
        include: { user: true, target_user: true },
      });
    });

    it('should return empty array if no logs found', async () => {
      mockPrisma.activityLog.findMany.mockResolvedValue([]);

      const result = await service.getLogsByUser('user-1');

      expect(result).toEqual([]);
    });
  });

  describe('getLogsTargetingUser', () => {
    it('should return logs targeting a user', async () => {
      const mockLogs = [
        { log_id: 'log-1', target_user_id: 'user-2', created_at: new Date() },
      ];

      mockPrisma.activityLog.findMany.mockResolvedValue(mockLogs);

      const result = await service.getLogsTargetingUser('user-2');

      expect(result).toEqual(mockLogs);
      expect(mockPrisma.activityLog.findMany).toHaveBeenCalledWith({
        where: { target_user_id: 'user-2' },
        orderBy: { created_at: 'desc' },
        include: { user: true, target_user: true },
      });
    });
  });

  describe('markAsRead', () => {
    it('should mark a single log as read', async () => {
      const mockLog = { log_id: 'log-1', is_read: true };

      mockPrisma.activityLog.update.mockResolvedValue(mockLog);

      const result = await service.markAsRead('log-1');

      expect(result).toEqual(mockLog);
      expect(mockPrisma.activityLog.update).toHaveBeenCalledWith({
        where: { log_id: 'log-1' },
        data: { is_read: true },
      });
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all unread logs as read for a user', async () => {
      mockPrisma.activityLog.updateMany.mockResolvedValue({ count: 3 });

      const result = await service.markAllAsRead('user-1');

      expect(result).toEqual({ count: 3 });
      expect(mockPrisma.activityLog.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'user-1', is_read: false },
        data: { is_read: true },
      });
    });
  });

  describe('getUnreadCount', () => {
    it('should return count of unread logs for a user', async () => {
      mockPrisma.activityLog.count.mockResolvedValue(5);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(5);
      expect(mockPrisma.activityLog.count).toHaveBeenCalledWith({
        where: { user_id: 'user-1', is_read: false },
      });
    });

    it('should return 0 if no unread logs', async () => {
      mockPrisma.activityLog.count.mockResolvedValue(0);

      const result = await service.getUnreadCount('user-1');

      expect(result).toBe(0);
    });
  });
});