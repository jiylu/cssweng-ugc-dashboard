import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeliverablesService } from '../deliverables.service';
import { DeliverableType, Prisma } from '@prisma/client';
import { CreateDeliverableDTO } from '../dto/create-deliverable.dto';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { UpdateDeliverableDTO } from '../dto/update-deliverable.dto';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

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
        quantity: 5,
        deliverableType: DeliverableType.COLLABORATION,
        deliverableContent: 'Instagram Carousel',
        requirements:
          'This is a test deliverable requirement with enough length to pass validation.',
        dueDate: new Date().toISOString(),
        postDate: new Date().toISOString(),
        pricing: 1500,
      };

      const mockDeliverable = {
        deliverable_id: 'del-1',
        public_id: 'mock-pb-id',
        campaign_id: dto.campaignId,
        quantity: dto.quantity,
        deliverable_type: dto.deliverableType,
        deliverable_content: dto.deliverableContent,
        requirements: dto.requirements,
        due_date: new Date(dto.dueDate),
        post_date: new Date(dto.postDate),
        pricing: new Prisma.Decimal(dto.pricing),
      };

      mockPrisma.deliverables.create.mockResolvedValue(mockDeliverable);

      const res = await service.createDeliverable(dto);
      expect(res).toEqual(mockDeliverable);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-pb-id',
          campaign_id: dto.campaignId,
          quantity: dto.quantity,
          deliverable_type: dto.deliverableType,
          deliverable_content: dto.deliverableContent,
          requirements: dto.requirements,
          due_date: new Date(dto.dueDate),
          post_date: new Date(dto.postDate),
          pricing: new Prisma.Decimal(dto.pricing),
        },
      });
    });

    it('should reject on invalid inputs', async () => {
      const dto: CreateDeliverableDTO = {
        campaignId: 'camp-1',
        quantity: 1,
        deliverableType: DeliverableType.COLLABORATION,
        deliverableContent: 'Short',
        requirements: 'short',
        dueDate: 'not-a-date',
        postDate: 'not-a-date',
        pricing: -100,
      };

      mockPrisma.deliverables.create.mockRejectedValue(
        new Error('Invalid input'),
      );

      await expect(service.createDeliverable(dto)).rejects.toThrow(
        'Invalid input',
      );
    });
  });

  describe('findOneDeliverableByUID', () => {
    it('should return a deliverable when it exists', async () => {
      const mockDeliverable = {
        deliverable_id: 'del-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        quantity: 3,
        deliverable_type: DeliverableType.UGC,
        deliverable_content: 'Instagram Image Post',
        requirements: 'This is a sufficiently long requirement for testing.',
        due_date: new Date(),
        post_date: new Date(),
        pricing: new Prisma.Decimal(1000),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(mockDeliverable);

      const res = await service.findOneDeliverableByUID('del-1');
      expect(res).toEqual(mockDeliverable);
      expect(mockPrisma.deliverables.findFirst).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-1', is_deleted: false },
      });
    });

    it('should throw NotFoundException when deliverable does not exist', async () => {
      mockPrisma.deliverables.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneDeliverableByUID('missing-del'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOneDeliverableByPublicId', () => {
    it('should return a deliverable when found by public ID', async () => {
      const mockDeliverable = {
        deliverable_id: 'del-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        quantity: 2,
        deliverable_type: DeliverableType.COLLABORATION,
        deliverable_content: 'YouTube Video',
        requirements: 'This is a sufficiently long requirement for testing.',
        due_date: new Date(),
        post_date: new Date(),
        pricing: new Prisma.Decimal(2000),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(mockDeliverable);

      const res = await service.findOneDeliverableByPublicId('abc1234567');
      expect(res).toEqual(mockDeliverable);
      expect(mockPrisma.deliverables.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'abc1234567', is_deleted: false },
      });
    });

    it('should throw NotFoundException when public ID not found', async () => {
      mockPrisma.deliverables.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneDeliverableByPublicId('nonexistent'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findDeliverablesForCampaign', () => {
    it('should return deliverables for a campaign', async () => {
      const campaignId = 'camp-1';
      const mockDeliverables = [
        {
          deliverable_id: 'd1',
          public_id: 'pub-d1-1234',
          campaign_id: campaignId,
          quantity: 1,
          deliverable_type: DeliverableType.UGC,
          deliverable_content: 'TikTok Short Form',
          requirements: 'Requirement long enough for d1',
          due_date: new Date(),
          post_date: new Date(),
          pricing: new Prisma.Decimal(500),
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.deliverables.findMany.mockResolvedValue(mockDeliverables);

      const res = await service.findDeliverablesForCampaign(campaignId);
      expect(res).toEqual(mockDeliverables);
      expect(mockPrisma.deliverables.findMany).toHaveBeenCalledWith({
        where: { campaign_id: campaignId, is_deleted: false },
        orderBy: { due_date: 'asc', post_date: 'asc' },
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
          deliverableContent: 'New Instagram Carousel',
        } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should update only one field successfully', async () => {
      const existing = {
        deliverable_id: 'del-1',
        public_id: 'pub-del-123',
        campaign_id: 'camp-1',
        quantity: 2,
        deliverable_type: DeliverableType.COLLABORATION,
        deliverable_content: 'Facebook Carousel',
        requirements: 'Old requirements long enough.',
        due_date: new Date('2026-06-01T00:00:00Z'),
        post_date: new Date('2026-06-05T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
      };

      const updated = { ...existing, quantity: 3 };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-1', {
        quantity: 3,
      });
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-1' },
        data: { quantity: 3 },
      });
    });

    it('should update two fields successfully', async () => {
      const existing = {
        deliverable_id: 'del-2',
        public_id: 'pub-del-456',
        campaign_id: 'camp-1',
        quantity: 1,
        deliverable_type: DeliverableType.COLLABORATION,
        deliverable_content: 'Instagram Image Post',
        requirements: 'Old requirements long enough.',
        due_date: new Date('2026-06-01T00:00:00Z'),
        post_date: new Date('2026-06-05T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
      };

      const dto = {
        deliverableContent: 'Updated Instagram Image Post',
        pricing: 0,
      } as UpdateDeliverableDTO;
      const updated = {
        ...existing,
        deliverable_content: dto.deliverableContent,
        pricing: new Prisma.Decimal(dto.pricing ?? 0),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-2', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-2' },
        data: {
          deliverable_content: dto.deliverableContent,
          pricing: new Prisma.Decimal(dto.pricing ?? 0),
        },
      });
    });

    it('should update all fields successfully', async () => {
      const existing = {
        deliverable_id: 'del-3',
        public_id: 'pub-del-789',
        campaign_id: 'camp-2',
        quantity: 4,
        deliverable_type: DeliverableType.UGC,
        deliverable_content: 'YouTube Video',
        requirements: 'Old requirements long enough.',
        due_date: new Date('2026-06-01T00:00:00Z'),
        post_date: new Date('2026-06-05T00:00:00Z'),
        pricing: new Prisma.Decimal(100),
      };

      const dto = {
        quantity: 5,
        deliverableType: DeliverableType.COLLABORATION,
        deliverableContent: 'Updated YouTube Video',
        requirements:
          'Updated requirements with enough detail to satisfy validation expectations.',
        dueDate: new Date('2026-07-01T00:00:00Z').toISOString(),
        postDate: new Date('2026-07-05T00:00:00Z').toISOString(),
        pricing: 999,
      } as UpdateDeliverableDTO;

      const updated = {
        ...existing,
        quantity: dto.quantity,
        deliverable_type: dto.deliverableType,
        deliverable_content: dto.deliverableContent,
        requirements: dto.requirements,
        due_date: new Date(dto.dueDate || 0),
        post_date: new Date(dto.postDate || 0),
        pricing: new Prisma.Decimal(dto.pricing || 0),
      };

      mockPrisma.deliverables.findFirst.mockResolvedValue(existing);
      mockPrisma.deliverables.update.mockResolvedValue(updated);

      const res = await service.updateDeliverableDetails('del-3', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.deliverables.update).toHaveBeenCalledWith({
        where: { deliverable_id: 'del-3' },
        data: {
          quantity: dto.quantity,
          deliverable_type: dto.deliverableType,
          deliverable_content: dto.deliverableContent,
          requirements: dto.requirements,
          due_date: new Date(dto.dueDate || 0),
          post_date: new Date(dto.postDate || 0),
          pricing: new Prisma.Decimal(dto.pricing || 0),
        },
      });
    });
  });

  describe('createManyDeliverables', () => {
    it('should create one deliverable', async () => {
      const campaignId = 'camp-1';
      const deliverables: CreateDeliverableDTO[] = [
        {
          campaignId,
          quantity: 2,
          deliverableType: DeliverableType.COLLABORATION,
          deliverableContent: 'Facebook Video',
          requirements: 'Requirement long enough for D1',
          dueDate: new Date().toISOString(),
          postDate: new Date().toISOString(),
          pricing: 100,
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create.mockResolvedValueOnce({
        deliverable_id: 'd1',
        public_id: 'mock-pb-id',
        campaign_id: campaignId,
        quantity: deliverables[0].quantity,
        deliverable_type: deliverables[0].deliverableType,
        deliverable_content: deliverables[0].deliverableContent,
        requirements: deliverables[0].requirements,
        due_date: new Date(deliverables[0].dueDate),
        post_date: new Date(deliverables[0].postDate),
        pricing: new Prisma.Decimal(deliverables[0].pricing),
      });

      const res = await service.createManyDeliverables(
        campaignId,
        deliverables,
      );
      expect(res).toHaveLength(1);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(1);
    });

    it('should create two deliverables', async () => {
      const campaignId = 'camp-1';
      const deliverables: CreateDeliverableDTO[] = Array.from({
        length: 2,
      }).map((_, i) => ({
        campaignId,
        quantity: i + 1,
        deliverableType: DeliverableType.UGC,
        deliverableContent: `TikTok Content ${i + 1}`,
        requirements: `Requirement for D${i + 1} long enough`,
        dueDate: new Date().toISOString(),
        postDate: new Date().toISOString(),
        pricing: 100 + i * 50,
      }));

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create
        .mockResolvedValueOnce({
          deliverable_id: 'd1',
          public_id: 'mock-pb-id',
          campaign_id: campaignId,
          quantity: deliverables[0].quantity,
          deliverable_type: deliverables[0].deliverableType,
          deliverable_content: deliverables[0].deliverableContent,
          requirements: deliverables[0].requirements,
          due_date: new Date(deliverables[0].dueDate),
          post_date: new Date(deliverables[0].postDate),
          pricing: new Prisma.Decimal(deliverables[0].pricing),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd2',
          public_id: 'mock-pb-id',
          campaign_id: campaignId,
          quantity: deliverables[1].quantity,
          deliverable_type: deliverables[1].deliverableType,
          deliverable_content: deliverables[1].deliverableContent,
          requirements: deliverables[1].requirements,
          due_date: new Date(deliverables[1].dueDate),
          post_date: new Date(deliverables[1].postDate),
          pricing: new Prisma.Decimal(deliverables[1].pricing),
        });

      const res = await service.createManyDeliverables(
        campaignId,
        deliverables,
      );
      expect(res).toHaveLength(2);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(2);
    });

    it('should create three deliverables', async () => {
      const campaignId = 'camp-1';
      const deliverables: CreateDeliverableDTO[] = Array.from({
        length: 3,
      }).map((_, i) => ({
        campaignId,
        quantity: i + 1,
        deliverableType: DeliverableType.COLLABORATION,
        deliverableContent: `Instagram Content ${i + 1}`,
        requirements: `Requirement for D${i + 1} long enough`,
        dueDate: new Date().toISOString(),
        postDate: new Date().toISOString(),
        pricing: 100 + i * 25,
      }));

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });

      mockPrisma.deliverables.create
        .mockResolvedValueOnce({
          deliverable_id: 'd1',
          public_id: 'mock-pb-id',
          campaign_id: campaignId,
          quantity: deliverables[0].quantity,
          deliverable_type: deliverables[0].deliverableType,
          deliverable_content: deliverables[0].deliverableContent,
          requirements: deliverables[0].requirements,
          due_date: new Date(deliverables[0].dueDate),
          post_date: new Date(deliverables[0].postDate),
          pricing: new Prisma.Decimal(deliverables[0].pricing),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd2',
          public_id: 'mock-pb-id',
          campaign_id: campaignId,
          quantity: deliverables[1].quantity,
          deliverable_type: deliverables[1].deliverableType,
          deliverable_content: deliverables[1].deliverableContent,
          requirements: deliverables[1].requirements,
          due_date: new Date(deliverables[1].dueDate),
          post_date: new Date(deliverables[1].postDate),
          pricing: new Prisma.Decimal(deliverables[1].pricing),
        })
        .mockResolvedValueOnce({
          deliverable_id: 'd3',
          public_id: 'mock-pb-id',
          campaign_id: campaignId,
          quantity: deliverables[2].quantity,
          deliverable_type: deliverables[2].deliverableType,
          deliverable_content: deliverables[2].deliverableContent,
          requirements: deliverables[2].requirements,
          due_date: new Date(deliverables[2].dueDate),
          post_date: new Date(deliverables[2].postDate),
          pricing: new Prisma.Decimal(deliverables[2].pricing),
        });

      const res = await service.createManyDeliverables(
        campaignId,
        deliverables,
      );
      expect(res).toHaveLength(3);
      expect(mockPrisma.deliverables.create).toHaveBeenCalledTimes(3);
    });

    it("should reject when campaign id doesn't exist", async () => {
      const campaignId = 'missing-camp';
      const deliverables: CreateDeliverableDTO[] = [
        {
          campaignId,
          quantity: 1,
          deliverableType: DeliverableType.COLLABORATION,
          deliverableContent: 'Facebook Video',
          requirements: 'Requirement long enough here',
          dueDate: new Date().toISOString(),
          postDate: new Date().toISOString(),
          pricing: 100,
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
