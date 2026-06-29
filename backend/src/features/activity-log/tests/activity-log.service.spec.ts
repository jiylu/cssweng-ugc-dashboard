import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ActivityLogService } from '../activity-log.service';
import { CreateActivityLogDto } from '../dto/create-activity-log.dto';
import { EntityType, Action } from '@prisma/client';

describe('ActivityLogService', () => {
  let service: ActivityLogService;

  const mockPrisma = {
    activityLog: {
      create: jest.fn(),
      findMany: jest.fn(),
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
        entityType: EntityType.CAMPAIGN,
        entityId: 'camp-1',
        action: Action.SUBMISSION,
      };

      const mockLog = {
        log_id: 'log-1',
        user_id: dto.userId,
        entity_type: dto.entityType,
        entity_id: dto.entityId,
        action: dto.action,
        created_at: new Date(),
      };

      mockPrisma.activityLog.create.mockResolvedValue(mockLog);

      const result = await service.createActivityLog(dto);

      expect(result).toEqual(mockLog);
      expect(mockPrisma.activityLog.create).toHaveBeenCalledWith({
        data: {
          user_id: dto.userId,
          entity_type: dto.entityType,
          entity_id: dto.entityId,
          action: dto.action,
          created_at: expect.any(Date),
        },
      });
    });

    it('should propagate errors from prisma', async () => {
      const dto: CreateActivityLogDto = {
        userId: 'user-1',
        entityType: EntityType.CAMPAIGN,
        entityId: 'camp-1',
        action: Action.SUBMISSION,
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
        include: { user: true },
      });
    });

    it('should return empty array if no logs found', async () => {
      mockPrisma.activityLog.findMany.mockResolvedValue([]);

      const result = await service.getLogsByUser('user-1');

      expect(result).toEqual([]);
    });
  });
});
