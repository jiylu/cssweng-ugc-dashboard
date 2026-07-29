import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns.service';
import {
  CampaignCurrency,
  CampaignStatus,
  Prisma,
  UserRoles,
} from '@prisma/client';
import { CreateCampaignDTO } from '../dto/create-campaign.dto';
import {
  ConflictException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { UpdateCampaignClientDTO } from '../dto/update-campaign-client.dto';
import { UserService } from 'src/features/users/users.service';
import { UpdateCampaignDetailsDTO } from '../dto/update-campaign-details.dto';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock_public_id_1234567890'),
}));

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
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a campaign', async () => {
      const now = new Date();
      const later = new Date(now.getTime() + 86_400_000);

      const mockCampaign = {
        campaign_id: '123abc',
        public_id: 'abc1234567',
        ugc_creator_id: 'ugc123abc',
        client_id: '',
        project_name: 'Test Project',
        description: 'Testing Project for Testing Purposes',
        pricing: new Prisma.Decimal(10000),
        platforms: ['Instagram', 'TikTok'],
        start_date: now,
        end_date: later,
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };

      const dto: CreateCampaignDTO = {
        ugcId: '123abc',
        projectName: 'Test Project',
        description: 'Testing Project for Testing Purposes',
        currency: CampaignCurrency.PHP,
        tax: 0,
        pricing: 10000,
        platforms: ['Instagram', 'TikTok'],
        startDate: now.toISOString(),
        endDate: later.toISOString(),
      };

      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: '123abc',
        is_active: true,
        role: UserRoles.CREATOR,
      });
      mockPrisma.campaigns.create.mockResolvedValue(mockCampaign);

      const res = await service.createCampaign(dto);
      expect(res).toEqual(mockCampaign);
      expect(mockUserService.getActiveUserById).toHaveBeenCalledWith('123abc');
      expect(mockPrisma.campaigns.create).toHaveBeenCalledWith({
        data: {
          public_id: expect.any(String),
          ugc_creator_id: '123abc',
          project_name: 'Test Project',
          description: 'Testing Project for Testing Purposes',
          currency: CampaignCurrency.PHP,
          tax: 0,
          pricing: new Prisma.Decimal(10000),
          platforms: ['Instagram', 'TikTok'],
          start_date: expect.any(Date),
          end_date: expect.any(Date),
        },
      });
    });

    it("should throw NotFoundException when ugc id doesn't exist", async () => {
      const dto: CreateCampaignDTO = {
        ugcId: 'missing-ugc',
        projectName: 'No UGC',
        description: 'Should fail',
        currency: CampaignCurrency.PHP,
        tax: 0,
        pricing: 500,
        platforms: ['Instagram'],
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
      };

      mockUserService.getActiveUserById.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createCampaign(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated campaigns with 15 mock data', async () => {
      const mockCampaigns = Array.from({ length: 15 }, (_, i) => ({
        campaign_id: `${i + 1}`,
        public_id: `pub_id_${i + 1}`,
        ugc_creator_id: i % 2 === 0 ? 'ugcA' : 'ugcB',
        client_id: '',
        project_name: `Project ${i + 1}`,
        description: `Description ${i + 1}`,
        pricing: new Prisma.Decimal(1000 + i * 100),
        platforms: ['Instagram'],
        start_date: new Date('2026-06-06T00:00:00.000Z'),
        end_date: new Date('2026-06-07T00:00:00.000Z'),
        created_at: new Date('2026-06-06T10:00:00.000Z'),
        campaign_status: CampaignStatus.ACTIVE,
      }));

      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: 'ugcA',
        is_active: true,
        role: UserRoles.CREATOR,
      });
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
        public_id: 'pub_client_1',
        ugc_creator_id: 'ugcA',
        client_id: 'client123',
        project_name: 'Client Project',
        description: 'Client Desc',
        pricing: new Prisma.Decimal(2000),
        platforms: ['Instagram'],
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
        public_id: 'pub_pending_1',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_pending_2',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_rejected_1',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_completed_1',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_camp123',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        role: UserRoles.CLIENT,
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

    it('should throw ForbiddenException when user role is CREATOR', async () => {
      const campaignId = 'camp123-creator';

      const mockCampaign = {
        campaign_id: campaignId,
        public_id: 'pub_camp123_creator',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
        start_date: new Date(),
        end_date: new Date(),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };

      const mockUser = {
        user_id: 'creator123',
        is_active: true,
        role: UserRoles.CREATOR,
      };

      jest
        .spyOn(service, 'findOneCampaign')
        .mockResolvedValue(mockCampaign as any);
      jest
        .spyOn(service, 'findOneActiveCampaignByClientId')
        .mockResolvedValue(null);
      mockUserService.getActiveUserById.mockResolvedValue(mockUser);

      await expect(
        service.updateCampaignClientId(campaignId, { clientId: 'creator123' }),
      ).rejects.toBeInstanceOf(ForbiddenException);
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
        public_id: 'pub_camp_with_client',
        ugc_creator_id: 'ugcA',
        client_id: 'existing-client',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_camp123_2',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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
        public_id: 'pub_camp123_3',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Test Project',
        description: 'Test Desc',
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
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

  describe('updateCampaignDetails', () => {
    it('should update all editable campaign details', async () => {
      const campaignId = 'camp-details-1';
      const existingCampaign = {
        campaign_id: campaignId,
        public_id: 'pub_details_1',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Old Project',
        description: 'Old Description',
        currency: CampaignCurrency.PHP,
        tax: new Prisma.Decimal(0),
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
        start_date: new Date('2026-06-01T00:00:00.000Z'),
        end_date: new Date('2026-06-10T00:00:00.000Z'),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };
      const dto: UpdateCampaignDetailsDTO = {
        projectName: 'Updated Project',
        description: 'Updated Description',
        currency: CampaignCurrency.USD,
        tax: 12,
        pricing: 2500,
        platforms: ['Instagram', 'TikTok'],
        startDate: '2026-07-01T00:00:00.000Z',
        endDate: '2026-07-15T00:00:00.000Z',
      };
      const updatedCampaign = {
        ...existingCampaign,
        project_name: dto.projectName,
        description: dto.description,
        currency: dto.currency,
        tax: dto.tax,
        pricing: new Prisma.Decimal(dto.pricing ?? 0),
        platforms: dto.platforms,
        start_date: new Date(dto.startDate ?? 0),
        end_date: new Date(dto.endDate ?? 0),
      };

      mockPrisma.campaigns.findFirst.mockResolvedValue(existingCampaign);
      mockPrisma.campaigns.update.mockResolvedValue(updatedCampaign);

      const res = await service.updateCampaignDetails(campaignId, dto);

      expect(res).toEqual(updatedCampaign);
      expect(mockPrisma.campaigns.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
      });
      expect(mockPrisma.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: {
          project_name: dto.projectName,
          description: dto.description,
          currency: dto.currency,
          tax: dto.tax,
          pricing: new Prisma.Decimal(dto.pricing ?? 0),
          platforms: dto.platforms,
          start_date: new Date(dto.startDate ?? 0),
          end_date: new Date(dto.endDate ?? 0),
        },
      });
    });

    it('should update only provided fields and preserve zero values', async () => {
      const campaignId = 'camp-details-2';
      const existingCampaign = {
        campaign_id: campaignId,
        public_id: 'pub_details_2',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Old Project',
        description: 'Old Description',
        currency: CampaignCurrency.PHP,
        tax: new Prisma.Decimal(12),
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
        start_date: new Date('2026-06-01T00:00:00.000Z'),
        end_date: new Date('2026-06-10T00:00:00.000Z'),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };
      const dto: UpdateCampaignDetailsDTO = {
        tax: 0,
        pricing: 0,
      };
      const updatedCampaign = {
        ...existingCampaign,
        tax: dto.tax,
        pricing: new Prisma.Decimal(dto.pricing ?? 0),
      };

      mockPrisma.campaigns.findFirst.mockResolvedValue(existingCampaign);
      mockPrisma.campaigns.update.mockResolvedValue(updatedCampaign);

      const res = await service.updateCampaignDetails(campaignId, dto);

      expect(res).toEqual(updatedCampaign);
      expect(mockPrisma.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: {
          tax: 0,
          pricing: new Prisma.Decimal(0),
        },
      });
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      mockPrisma.campaigns.findFirst.mockResolvedValue(null);

      await expect(
        service.updateCampaignDetails('missing-camp', {
          projectName: 'Updated Project',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.campaigns.update).not.toHaveBeenCalled();
    });

    it('should use the provided transaction client', async () => {
      const campaignId = 'camp-details-tx';
      const existingCampaign = {
        campaign_id: campaignId,
        public_id: 'pub_details_tx',
        ugc_creator_id: 'ugcA',
        client_id: '',
        project_name: 'Old Project',
        description: 'Old Description',
        currency: CampaignCurrency.PHP,
        tax: new Prisma.Decimal(12),
        pricing: new Prisma.Decimal(1000),
        platforms: ['Instagram'],
        start_date: new Date('2026-06-01T00:00:00.000Z'),
        end_date: new Date('2026-06-10T00:00:00.000Z'),
        created_at: new Date(),
        campaign_status: CampaignStatus.ACTIVE,
      };
      const updatedCampaign = {
        ...existingCampaign,
        project_name: 'Updated In Transaction',
      };
      const mockTx = {
        campaigns: {
          findFirst: jest.fn().mockResolvedValue(existingCampaign),
          update: jest.fn().mockResolvedValue(updatedCampaign),
        },
      };

      const res = await service.updateCampaignDetails(
        campaignId,
        { projectName: 'Updated In Transaction' },
        mockTx as any,
      );

      expect(res).toEqual(updatedCampaign);
      expect(mockTx.campaigns.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
      });
      expect(mockTx.campaigns.update).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        data: {
          project_name: 'Updated In Transaction',
        },
      });
      expect(mockPrisma.campaigns.update).not.toHaveBeenCalled();
    });
  });

  describe('resolveCampaignPublicId', () => {
    it('should return the campaign_id for a valid publicId', async () => {
      const publicId = 'pub_valid_1';
      const mockResult = { campaign_id: 'camp_internal_1' };

      mockPrisma.campaigns.findFirst.mockResolvedValue(mockResult);

      const res = await service.resolveCampaignPublicId(publicId);

      expect(res).toBe('camp_internal_1');
      expect(mockPrisma.campaigns.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId },
        select: { campaign_id: true },
      });
    });

    it('should throw NotFoundException when no campaign matches the publicId', async () => {
      const publicId = 'pub_missing';

      mockPrisma.campaigns.findFirst.mockResolvedValue(null);

      await expect(
        service.resolveCampaignPublicId(publicId),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockPrisma.campaigns.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId },
        select: { campaign_id: true },
      });
    });

    it('should only select campaign_id and not return the full campaign object', async () => {
      const publicId = 'pub_select_check';
      // findFirst only returns the selected field
      mockPrisma.campaigns.findFirst.mockResolvedValue({
        campaign_id: 'camp_select_check',
      });

      const res = await service.resolveCampaignPublicId(publicId);

      // result must be the plain id string, not an object
      expect(typeof res).toBe('string');
      expect(res).toBe('camp_select_check');
    });
  });
});
