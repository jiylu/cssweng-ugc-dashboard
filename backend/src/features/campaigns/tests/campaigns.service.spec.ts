import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns.service';
import { CampaignStatus, Prisma } from '@prisma/client';
import { CreateCampaignDTO } from '../dto/create-campaign.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';
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
        campaign_status: CampaignStatus.ACTIVE,
      };

      const dto: CreateCampaignDTO = {
        ugcId: '123abc',
        projectName: 'Test Project',
        description: 'Testing Project for Testing Purposes',
        pricing: 10000,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
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
        },
      });
    });

    it("should throw NotFoundException when ugc id doesn't exist", async () => {
      const dto: CreateCampaignDTO = {
        ugcId: 'missing-ugc',
        projectName: 'No UGC',
        description: 'Should fail',
        pricing: 500,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };

      mockPrisma.campaigns.create.mockRejectedValue(new NotFoundException());

      await expect(service.createCampaign(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
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

  describe('findOneActiveCampaignByClientId', () => {
    it('should return one active campaign for a client', async () => {
      const mockCampaign = {
        campaign_id: 'campClient1',
        ugc_creator_id: 'ugcA',
        client_id: 'client123',
        project_name: 'Client Project',
        description: 'Client Desc',
        pricing: new Prisma.Decimal(2000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };

      const mockUser = {
        user_id: 'client123',
        email: 'client@test.com',
        createdAt: new Date(),
        first_name: 'Client',
        last_name: 'User',
        role: 'CLIENT',
        is_active: true,
      };

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.campaigns.findFirst.mockResolvedValue(mockCampaign);

      const res = await service.findOneActiveCampaignByClientId('client123');
      expect(res).toEqual(mockCampaign);
      expect(mockPrisma.campaigns.findFirst).toHaveBeenCalledWith({
        where: {
          client_id: 'client123',
          campaign_status: CampaignStatus.ACTIVE,
        },
      });
    });

    it('should return null when no active campaign for client', async () => {
      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: 'client123',
        is_active: true,
      });
      mockPrisma.campaigns.findFirst.mockResolvedValue(null);

      const res = await service.findOneActiveCampaignByClientId('client123');
      expect(res).toBeNull();
    });

    it('should throw NotFoundException when user not found', async () => {
      mockUserService.getActiveUserById.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        service.findOneActiveCampaignByClientId('missing'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateCampaignStatus', () => {
    it('should update from ACTIVE to REJECTED', async () => {
      const campaignId = 'camp-pending-1';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };

      const dto = {
        campaignStatus: CampaignStatus.REJECTED,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      mockPrisma.campaigns.update.mockResolvedValue({
        ...mockCampaign,
        campaign_status: CampaignStatus.REJECTED,
      });

      const result = await service.updateCampaignStatus(campaignId, dto);
      expect(result).toEqual({
        ...mockCampaign,
        campaign_status: CampaignStatus.REJECTED,
      });

      expect(mockPrisma.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: { campaign_status: CampaignStatus.REJECTED },
      });
    });

    it('should update from ACTIVE to COMPLETED', async () => {
      const campaignId = 'camp-pending-2';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
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
        data: { campaign_status: CampaignStatus.COMPLETED },
      });
    });

    it('should throw when trying to change from REJECTED to ACTIVE', async () => {
      const campaignId = 'camp-rejected-1';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.REJECTED,
      };

      const dto = {
        campaignStatus: CampaignStatus.ACTIVE,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      const res = service.updateCampaignStatus(campaignId, dto);
      await expect(res).rejects.toBeInstanceOf(ConflictException);
    });

    it('should throw when trying to change from COMPLETED to ACTIVE', async () => {
      const campaignId = 'camp-completed-1';

      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.COMPLETED,
      };

      const dto = {
        campaignStatus: CampaignStatus.ACTIVE,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      const res = service.updateCampaignStatus(campaignId, dto);
      await expect(res).rejects.toBeInstanceOf(ConflictException);
    });
  });

  describe('updateCampaignClientId', () => {
    it('should update the client_id for the campaign when campaign exists and client has no active engagements', async () => {
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
        campaign_status: CampaignStatus.ACTIVE,
      };

      const updatedCampaign = {
        ...mockCampaign,
        client_id: 'testclient123',
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

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      // ensure there is no active engagement for this client
      jest
        .spyOn(service, 'findOneActiveCampaignByClientId')
        .mockResolvedValue(null);
      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.campaigns.update.mockResolvedValue(updatedCampaign);

      const dto: UpdateCampaignClientDTO = { clientId: 'testclient123' };
      const res = await service.updateCampaignClientId(campaignId, dto);
      expect(res).toEqual(updatedCampaign);
      expect(mockPrisma.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: { client_id: 'testclient123' },
      });
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      const campaignId = 'missing-camp';
      const dto: UpdateCampaignClientDTO = { clientId: 'testclient123' };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockRejectedValue(new NotFoundException());

      await expect(
        service.updateCampaignClientId(campaignId, dto),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ConflictException if campaign already has a client', async () => {
      const campaignId = 'camp-with-client';
      const mockCampaign = {
        campaign_id: campaignId,
        ugc_creator_id: 'ugcA',
        client_id: 'existing-client',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };

      jest.spyOn(service, 'findOneCampaign').mockResolvedValue(mockCampaign);

      await expect(
        service.updateCampaignClientId(campaignId, { clientId: 'new-client' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should throw NotFoundException when client id does not exist', async () => {
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
        campaign_status: CampaignStatus.ACTIVE,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      mockUserService.getActiveUserById.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.updateCampaignClientId(campaignId, {
          clientId: 'missing-client',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ConflictException when client exists but has an active engagement', async () => {
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
        campaign_status: CampaignStatus.ACTIVE,
      };

      const mockUser = { user_id: 'client123' };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      // simulate an active campaign for this client
      jest
        .spyOn(service, 'findOneActiveCampaignByClientId')
        .mockResolvedValue({ campaign_id: 'active-camp' } as any);

      await expect(
        service.updateCampaignClientId(campaignId, { clientId: 'client123' }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
