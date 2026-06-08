import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns.service';
import { CampaignStatus, CampaignType, Prisma } from '@prisma/client';
import { CreateCampaignDTO } from '../dto/create-campaign.dto';
import { ConflictException } from '@nestjs/common';
import { UpdateCampaignClientDTO } from '../dto/update-campaign-client.dto';
import { UserService } from 'src/features/users/users.service';

describe('CampaignService', () => {
  let service: CampaignsService;

  const mockPrisma = {
    campaigns: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUserService = {
    getActiveUserById: jest.fn(),
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-06T16:35:51.366Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<CampaignsService>(CampaignsService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('create', () => {
    it('should create a campaign', async () => {
      const mockCampaign = {
        campaign_id: '123abc',
        ugc_creator_id: 'ugc123abc',
        client_id: '',
        project_name: 'Test Project',
        description: 'Testing Project for Testing Purposes',
        pricing: new Prisma.Decimal(10000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.ACTIVE,
      };

      const dto: CreateCampaignDTO = {
        ugcId: '123abc',
        projectName: 'Test Project',
        description: 'Testing Project for Testing Purposes',
        pricing: 10000,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        campaignType: CampaignType.UGC,
      };

      mockPrisma.campaigns.create.mockResolvedValue(mockCampaign);

      const res = await service.createCampaign(dto);
      expect(res).toEqual(mockCampaign);
      expect(mockPrisma.campaigns.create).toHaveBeenCalledWith({
        data: {
          ugc_creator_id: '123abc',
          project_name: 'Test Project',
          description: 'Testing Project for Testing Purposes',
          pricing: new Prisma.Decimal(10000),
          start_date: new Date(),
          end_date: new Date(),
          campaign_type: CampaignType.UGC,
        },
      });
    });
  });

  describe('findAll', () => {
    it('should return paginated campaigns with 15 mock data', async () => {
      const mockCampaigns = Array.from({ length: 15 }, (_, i) => ({
        campaign_id: `${i + 1}`,
        ugc_creator_id: i % 2 === 0 ? 'ugcA' : 'ugcB',
        project_name: `Project ${i + 1}`,
        description: `Description ${i + 1}`,
        pricing: new Prisma.Decimal(1000 + i * 100),
        start_date: new Date('2026-06-06T00:00:00.000Z'),
        end_date: new Date('2026-06-07T00:00:00.000Z'),
        created_at: new Date('2026-06-06T10:00:00.000Z'),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.ACTIVE,
      }));

      mockPrisma.campaigns.findMany.mockResolvedValue(mockCampaigns);

      const query = {
        creatorId: 'ugcA',
        page: 2,
        limit: 5,
      };

      const res = await service.findAllCampaigns(query);

      expect(res).toEqual(mockCampaigns);

      expect(mockPrisma.campaigns.findMany).toHaveBeenCalledWith({
        where: {
          ugc_creator_id: 'ugcA',
        },
        skip: 5,
        take: 5,
        orderBy: {
          created_at: 'desc',
        },
      });
    });
  });

  describe('updateCampaignStatus', () => {
    it('should update campaign status successfully', async () => {
      const campaignId = 'camp123';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.ACTIVE,
      };

      const dto = {
        campaignStatus: CampaignStatus.COMPLETED,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);

      mockPrisma.campaigns.update.mockResolvedValue({
        ...mockCampaign,
        campaign_status: CampaignStatus.COMPLETED,
      });

      const result = await service.updateCampaignStatus(campaignId, dto);

      expect(result).toEqual({
        ...mockCampaign,
        campaign_status: CampaignStatus.COMPLETED,
      });

      expect(mockPrisma.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: {
          campaign_status: CampaignStatus.COMPLETED,
        },
      });
    });

    it('should throw an error when trying to update a rejected campaign', async () => {
      const campaignId = 'camp123';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.REJECTED,
      };

      const dto = {
        campaignStatus: CampaignStatus.ACTIVE,
      };

      mockPrisma.campaigns.findFirst.mockResolvedValue(mockCampaign);
      const res = service.updateCampaignStatus(campaignId, dto);
      await expect(res).rejects.toThrow(ConflictException);
    });
  });

  describe('updateCampaignClientId', () => {
    it('should throw ConflictException if campaign already has a client', async () => {
      const mockCampaign = {
        campaign_id: 'camp123',
        ugc_creator_id: 'ugcA',
        client_id: '123client',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.REJECTED,
      };

      const dto: UpdateCampaignClientDTO = {
        clientId: 'testclient123',
      };

      mockPrisma.campaigns.findFirst.mockResolvedValue(mockCampaign);
      const res = service.updateCampaignClientId('camp123', dto);
      await expect(res).rejects.toThrow(ConflictException);
    });

    it('should update the client_id for the campaign', async () => {
      const mockCampaign = {
        campaign_id: 'camp123',
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.ACTIVE,
      };

      const updatedCampaign = {
        campaign_id: 'camp123',
        ugc_creator_id: 'ugcA',
        client_id: 'testclient123',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_type: CampaignType.UGC,
        campaign_status: CampaignStatus.ACTIVE,
      };

      const mockUser = {
        user_id: 'testclient123',
        email: 'testemail@test.com',
        createdAt: new Date(),
        first_name: 'John',
        last_name: 'Doe',
        role: 'CREATOR',
        is_active: true,
      };

      const dto: UpdateCampaignClientDTO = {
        clientId: 'testclient123',
      };

      mockPrisma.campaigns.findFirst.mockResolvedValue(mockCampaign);
      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.campaigns.update.mockResolvedValue(updatedCampaign);
      const res = await service.updateCampaignClientId('camp123', dto);
      expect(res).toEqual(updatedCampaign);
    });
  });
});
