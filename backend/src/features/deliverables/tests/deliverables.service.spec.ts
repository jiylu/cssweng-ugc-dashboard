import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliverablesService } from '../deliverables.service';
import { DeliverableType, Prisma } from '@prisma/client';
import { CreateDeliverableDTO } from '../dto/create-deliverable.dto';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { UpdateDeliverableDTO } from '../dto/update-deliverable.dto';

describe('DeliverablesService', () => {
  let service: DeliverablesService;

  const mockPrisma = {
    deliverables: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliverablesService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignService,
        } as any,
      ],
    }).compile();

    service = module.get<DeliverablesService>(DeliverablesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createDeliverable', () => {
    it('should create a deliverable successfully', async () => {
      const dto: CreateDeliverableDTO = {
        campaignId: 'camp-1',
        deliverableTitle: 'Test Deliverable',
        description:
          'This is a test deliverable description with enough length.',
        deadline: new Date().toISOString(),
        pricing: 1500,
        deliverableType: DeliverableType.COLLABORATION,
      };

      const mockDeliverable = {
        deliverable_id: 'del-1',
        campaign_id: dto.campaignId,
        deliverable_title: dto.deliverableTitle,
        description: dto.description,
        deadline: new Date(dto.deadline),
        pricing: new Prisma.Decimal(dto.pricing),
        deliverable_type: dto.deliverableType,
        created_at: new Date(),
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.deliverables.create.mockResolvedValue(mockDeliverable);

      const res = await service.createDeliverable(dto);
      expect(res).toEqual(mockDeliverable);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledWith({
        data: {
          campaign_id: dto.campaignId,
          deliverable_title: dto.deliverableTitle,
          description: dto.description,
          deadline: new Date(dto.deadline),
          pricing: new Prisma.Decimal(dto.pricing),
          deliverable_type: dto.deliverableType,
        },
      });
    });

    it('should reject on invalid inputs', async () => {
      const dto: CreateDeliverableDTO = {
        campaignId: 'camp-1',
        deliverableTitle: '', // invalid title
        description: 'short', // invalid description (too short)
        deadline: 'not-a-date',
        pricing: -100,
        deliverableType: DeliverableType.COLLABORATION,
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.deliverables.create.mockRejectedValue(
        new Error('Invalid input'),
      );

      await expect(service.createDeliverable(dto)).rejects.toThrow(
        'Invalid input',
      );
    });
  });

  describe('findOneDeliverable', () => {
    it('should return a deliverable when it exists', async () => {
      const mockDeliverable = {
        deliverable_id: 'del-1',
        campaign_id: 'camp-1',
        deliverable_title: 'Test Deliverable',
        description: 'This is a sufficiently long description for testing.',
        deadline: new Date(),
        pricing: new Prisma.Decimal(1000),
        deliverable_type: 'IMAGE',
        created_at: new Date(),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(mockDeliverable);

      const res = await service.findOneDeliverable('del-1');
      expect(res).toEqual(mockDeliverable);
      expect(mockPrisma.deliverables.findFirst).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-1' },
      });
    });

    it('should throw NotFoundException when deliverable does not exist', async () => {
      mockPrisma.deliverables.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneDeliverable('missing-del'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findDeliverablesForCampaign', () => {
    it('should return deliverables for a campaign', async () => {
      const campaignId = 'camp-1';
      const mockDeliverables = [
        {
          deliverable_id: 'd1',
          campaign_id: campaignId,
          deliverable_title: 'D1',
          description: 'Description long enough for d1',
          deadline: new Date(),
          pricing: new Prisma.Decimal(500),
          deliverable_type: 'VIDEO',
          created_at: new Date(),
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.deliverables.findMany.mockResolvedValue(mockDeliverables);

      const res = await service.findDeliverablesForCampaign(campaignId);
      expect(res).toEqual(mockDeliverables);
      expect(mockPrisma.deliverables.findMany).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        orderBy: { deadline: 'asc' },
      });
    });

    it('should throw NotFoundException when campaign id does not exist', async () => {
      const campaignId = 'missing-camp';
      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        service.findDeliverablesForCampaign(campaignId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateDeliverableDetails', () => {
    it('should throw NotFoundException when deliverable does not exist', async () => {
      mockPrisma.deliverables.findFirst.mockResolvedValue(null);
      await expect(
        service.updateDeliverableDetails('missing-del', {
          deliverableTitle: 'New',
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update only one field successfully', async () => {
      const existing = {
        deliverable_id: 'del-1',
        campaign_id: 'camp-1',
        deliverable_title: 'Old Title',
        description: 'Old description long enough.',
        deadline: new Date('2026-06-01T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
        deliverable_type: DeliverableType.COLLABORATION,
        created_at: new Date(),
      };

      const updated = { ...existing, deliverable_title: 'New Title' };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-1', {
        deliverableTitle: 'New Title',
      });
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-1' },
        data: { deliverable_title: 'New Title' },
      });
    });

    it('should update two fields successfully', async () => {
      const existing = {
        deliverable_id: 'del-2',
        campaign_id: 'camp-1',
        deliverable_title: 'Title',
        description: 'Old description long enough.',
        deadline: new Date('2026-06-01T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
        deliverable_type: DeliverableType.COLLABORATION,
        created_at: new Date(),
      };

      const dto = {
        description: 'New description with enough length.',
        pricing: 250,
      } as UpdateDeliverableDTO;
      const updated = {
        ...existing,
        description: dto.description,
        pricing: new Prisma.Decimal(dto.pricing || 0),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-2', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-2' },
        data: {
          description: dto.description,
          pricing: new Prisma.Decimal(dto.pricing || 0),
        },
      });
    });

    it('should update all fields successfully', async () => {
      const existing = {
        deliverable_id: 'del-3',
        campaign_id: 'camp-2',
        deliverable_title: 'Old',
        description: 'Old description long enough.',
        deadline: new Date('2026-06-01T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
        deliverable_type: DeliverableType.UGC,
        created_at: new Date(),
      };

      const dto = {
        deliverableTitle: 'New All',
        description: 'Completely new description that is long enough.',
        deadline: new Date('2026-07-01T00:00:00Z').toISOString(),
        pricing: 999,
        deliverableType: DeliverableType.COLLABORATION,
      } as UpdateDeliverableDTO;

      const updated = {
        ...existing,
        deliverable_title: dto.deliverableTitle,
        description: dto.description,
        deadline: new Date(dto.deadline || 0),
        pricing: new Prisma.Decimal(dto.pricing || 0),
        deliverable_type: dto.deliverableType,
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-3', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-3' },
        data: {
          deliverable_title: dto.deliverableTitle,
          description: dto.description,
          deadline: new Date(dto.deadline || 0),
          pricing: new Prisma.Decimal(dto.pricing || 0),
          deliverable_type: dto.deliverableType,
        },
      });
    });
  });

  describe('createManyDeliverables', () => {
    it('should create one deliverable', async () => {
      const campaignId = 'camp-1';
      const deliverables = [
        {
          campaignId,
          deliverableTitle: 'D1',
          description: 'Description long enough for D1',
          deadline: new Date().toISOString(),
          pricing: 100,
          deliverableType: DeliverableType.COLLABORATION,
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create.mockResolvedValueOnce({
        deliverable_id: 'd1',
        campaign_id: campaignId,
        deliverable_title: deliverables[0].deliverableTitle,
        description: deliverables[0].description,
        deadline: new Date(deliverables[0].deadline),
        pricing: new Prisma.Decimal(deliverables[0].pricing),
        deliverable_type: deliverables[0].deliverableType,
        created_at: new Date(),
      });

      const res = await service.createManyDeliverables(campaignId, deliverables);
      expect(res).toHaveLength(1);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(1);
    });

    it('should create two deliverables', async () => {
      const campaignId = 'camp-1';
      const deliverables = Array.from({ length: 2 }).map((_, i) => ({
        campaignId,
        deliverableTitle: `D${i + 1}`,
        description: `Description for D${i + 1} long enough`,
        deadline: new Date().toISOString(),
        pricing: 100 + i * 50,
        deliverableType: DeliverableType.UGC,
      }));

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create
        .mockResolvedValueOnce({
          deliverable_id: 'd1',
          campaign_id: campaignId,
          deliverable_title: deliverables[0].deliverableTitle,
          description: deliverables[0].description,
          deadline: new Date(deliverables[0].deadline),
          pricing: new Prisma.Decimal(deliverables[0].pricing),
          deliverable_type: deliverables[0].deliverableType,
          created_at: new Date(),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd2',
          campaign_id: campaignId,
          deliverable_title: deliverables[1].deliverableTitle,
          description: deliverables[1].description,
          deadline: new Date(deliverables[1].deadline),
          pricing: new Prisma.Decimal(deliverables[1].pricing),
          deliverable_type: deliverables[1].deliverableType,
          created_at: new Date(),
        });

      const res = await service.createManyDeliverables(campaignId, deliverables);
      expect(res).toHaveLength(2);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(2);
    });

    it('should create three deliverables', async () => {
      const campaignId = 'camp-1';
      const deliverables = Array.from({ length: 3 }).map((_, i) => ({
        campaignId,
        deliverableTitle: `D${i + 1}`,
        description: `Description for D${i + 1} long enough`,
        deadline: new Date().toISOString(),
        pricing: 100 + i * 25,
        deliverableType: DeliverableType.VIDEO,
      }));

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create
        .mockResolvedValueOnce({
          deliverable_id: 'd1',
          campaign_id: campaignId,
          deliverable_title: deliverables[0].deliverableTitle,
          description: deliverables[0].description,
          deadline: new Date(deliverables[0].deadline),
          pricing: new Prisma.Decimal(deliverables[0].pricing),
          deliverable_type: deliverables[0].deliverableType,
          created_at: new Date(),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd2',
          campaign_id: campaignId,
          deliverable_title: deliverables[1].deliverableTitle,
          description: deliverables[1].description,
          deadline: new Date(deliverables[1].deadline),
          pricing: new Prisma.Decimal(deliverables[1].pricing),
          deliverable_type: deliverables[1].deliverableType,
          created_at: new Date(),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd3',
          campaign_id: campaignId,
          deliverable_title: deliverables[2].deliverableTitle,
          description: deliverables[2].description,
          deadline: new Date(deliverables[2].deadline),
          pricing: new Prisma.Decimal(deliverables[2].pricing),
          deliverable_type: deliverables[2].deliverableType,
          created_at: new Date(),
        });

      const res = await service.createManyDeliverables(campaignId, deliverables);
      expect(res).toHaveLength(3);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(3);
    });

    it("should reject when campaign id doesn't exist", async () => {
      const campaignId = 'missing-camp';
      const deliverables = [
        {
          campaignId,
          deliverableTitle: 'D1',
          description: 'Description',
          deadline: new Date().toISOString(),
          pricing: 100,
          deliverableType: DeliverableType.COLLABORATION,
        },
      ];

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.createManyDeliverables(campaignId, deliverables),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
