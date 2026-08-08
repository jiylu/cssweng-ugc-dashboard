import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { AddOnsService } from '../add-ons.service';
import { CreateAddOnDTO } from '../dto/create-add-on-dto';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { UpdateOptInDTO } from '../dto/update-opt-in.dto';
import { UpdateAddOnDTO } from '../dto/update-add-on.dto';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

describe('AddOnsService', () => {
  let service: AddOnsService;

  const mockPrisma = {
    addOns: {
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
        AddOnsService,
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

    service = module.get<AddOnsService>(AddOnsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createAddOn', () => {
    it('should create an add-on successfully', async () => {
      const dto: CreateAddOnDTO = {
        campaignId: 'camp-1',
        addOnName: 'Photography',
        description: 'Description description',
        fee: 500,
        initials: 'PH',
      };

      const mockAddOn = {
        add_on_id: 'addon-1',
        public_id: 'mock-pb-id',
        campaign_id: dto.campaignId,
        add_on_name: dto.addOnName,
        fee: dto.fee,
        initials: dto.initials,
        opt_in: false,
      };

      mockPrisma.addOns.create.mockResolvedValue(mockAddOn);

      const res = await service.createAddOn(dto);
      expect(res).toEqual(mockAddOn);
      expect(mockPrisma.addOns.create).toHaveBeenCalledWith({
        data: {
          campaign_id: dto.campaignId,
          public_id: 'mock-pb-id',
          description: 'Description description',
          add_on_name: dto.addOnName,
          fee: dto.fee,
          initials: dto.initials,
        },
      });
    });

    it('should reject on invalid inputs', async () => {
      const dto: CreateAddOnDTO = {
        campaignId: 'camp-1',
        addOnName: '',
        description: 'asdasdadasdsadsad',
        fee: -100,
        initials: '',
      };

      mockPrisma.addOns.create.mockRejectedValue(new Error('Invalid input'));

      await expect(service.createAddOn(dto)).rejects.toThrow('Invalid input');
    });
  });

  describe('createManyAddOns', () => {
    it('should create one add-on', async () => {
      const addOns: CreateAddOnDTO[] = [
        {
          campaignId: 'camp-1',
          addOnName: 'Photography',
          description: 'Description description',
          fee: 500,
          initials: 'PH',
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });

      mockPrisma.addOns.create.mockResolvedValueOnce({
        add_on_id: 'addon-1',
        public_id: 'mock-pb-id',
        campaign_id: 'camp-1',
        add_on_name: addOns[0].addOnName,
        fee: addOns[0].fee,
        initials: addOns[0].initials,
        opt_in: false,
      });

      const res = await service.createManyAddOns('camp-1', addOns);
      expect(res).toHaveLength(1);
      expect(mockPrisma.addOns.create).toHaveBeenCalledTimes(1);
    });

    it('should create two add-ons', async () => {
      const addOns: CreateAddOnDTO[] = [
        {
          campaignId: 'camp-1',
          addOnName: 'Photography',
          description: 'Description description',
          fee: 500,
          initials: 'PH',
        },
        {
          campaignId: 'camp-1',
          addOnName: 'Videography',
          description: 'Description description',
          fee: 1000,
          initials: 'VD',
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });

      mockPrisma.addOns.create
        .mockResolvedValueOnce({
          add_on_id: 'addon-1',
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          add_on_name: addOns[0].addOnName,
          fee: addOns[0].fee,
          initials: addOns[0].initials,
          opt_in: false,
        })
        .mockResolvedValueOnce({
          add_on_id: 'addon-2',
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          add_on_name: addOns[1].addOnName,
          fee: addOns[1].fee,
          initials: addOns[1].initials,
          opt_in: false,
        });

      const res = await service.createManyAddOns('camp-1', addOns);
      expect(res).toHaveLength(2);
      expect(mockPrisma.addOns.create).toHaveBeenCalledTimes(2);
    });

    it('should create three add-ons', async () => {
      const addOns: CreateAddOnDTO[] = Array.from({ length: 3 }).map(
        (_, i) => ({
          campaignId: 'camp-1',
          addOnName: `Add-On ${i + 1}`,
          description: 'Description description',
          fee: 100 + i * 50,
          initials: `A${i + 1}`,
        }),
      );

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });

      mockPrisma.addOns.create
        .mockResolvedValueOnce({
          add_on_id: 'addon-1',
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          add_on_name: addOns[0].addOnName,
          fee: addOns[0].fee,
          initials: addOns[0].initials,
          opt_in: false,
        })
        .mockResolvedValueOnce({
          add_on_id: 'addon-2',
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          add_on_name: addOns[1].addOnName,
          fee: addOns[1].fee,
          initials: addOns[1].initials,
          opt_in: false,
        })
        .mockResolvedValueOnce({
          add_on_id: 'addon-3',
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          add_on_name: addOns[2].addOnName,
          fee: addOns[2].fee,
          initials: addOns[2].initials,
          opt_in: false,
        });

      const res = await service.createManyAddOns('camp-1', addOns);
      expect(res).toHaveLength(3);
      expect(mockPrisma.addOns.create).toHaveBeenCalledTimes(3);
    });

    it("should reject when campaign id doesn't exist", async () => {
      const addOns: CreateAddOnDTO[] = [
        {
          campaignId: 'missing-camp',
          addOnName: 'Photography',
          description: 'Description description',
          fee: 500,
          initials: 'PH',
        },
      ];

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.createManyAddOns('missing-camp', addOns),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findAddOnsForCampaign', () => {
    it('should return add-ons for a campaign', async () => {
      const campaignId = 'camp-1';
      const mockAddOns = [
        {
          add_on_id: 'addon-1',
          public_id: 'pub-ao-1234',
          campaign_id: campaignId,
          add_on_name: 'Photography',
          fee: 500,
          initials: 'PH',
          opt_in: false,
        },
        {
          add_on_id: 'addon-2',
          public_id: 'pub-ao-5678',
          campaign_id: campaignId,
          add_on_name: 'Videography',
          fee: 1000,
          initials: 'VD',
          opt_in: true,
        },
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.addOns.findMany.mockResolvedValue(mockAddOns);

      const res = await service.findAddOnsForCampaign(campaignId);
      expect(res).toEqual(mockAddOns);
      expect(mockPrisma.addOns.findMany).toHaveBeenCalledWith({
        where: { campaign_id: campaignId, is_deleted: false },
      });
    });

    it('should return null when no add-ons exist for the campaign', async () => {
      const campaignId = 'camp-1';

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.addOns.findMany.mockResolvedValue([]);

      const res = await service.findAddOnsForCampaign(campaignId);
      expect(res).toBeNull();
    });

    it('should throw NotFoundException when campaign id does not exist', async () => {
      const campaignId = 'missing-camp';
      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        service.findAddOnsForCampaign(campaignId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOneAddOnByUID', () => {
    it('should return an add-on when it exists', async () => {
      const mockAddOn = {
        add_on_id: 'addon-1',
        public_id: 'pub-ao-1234',
        campaign_id: 'camp-1',
        add_on_name: 'Photography',
        fee: 500,
        initials: 'PH',
        opt_in: false,
      };

      mockPrisma.addOns.findFirst.mockResolvedValue(mockAddOn);

      const res = await service.findOneAddOnByUID('addon-1');
      expect(res).toEqual(mockAddOn);
      expect(mockPrisma.addOns.findFirst).toHaveBeenCalledWith({
        where: { add_on_id: 'addon-1', is_deleted: false },
      });
    });

    it('should throw NotFoundException when add-on does not exist', async () => {
      mockPrisma.addOns.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneAddOnByUID('missing-addon'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateAddOnOptIn', () => {
    it('should update opt-in to true successfully', async () => {
      const existing = {
        add_on_id: 'addon-1',
        public_id: 'pub-ao-1234',
        campaign_id: 'camp-1',
        add_on_name: 'Photography',
        fee: 500,
        initials: 'PH',
        opt_in: false,
      };

      const updated = { ...existing, opt_in: true };

      mockPrisma.addOns.findFirst.mockResolvedValue(existing);
      mockPrisma.addOns.update.mockResolvedValue(updated);

      const dto: UpdateOptInDTO = { optIn: true };
      const res = await service.updateAddOnOptIn('addon-1', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.addOns.update).toHaveBeenCalledWith({
        where: { add_on_id: 'addon-1' },
        data: { opt_in: true },
      });
    });

    it('should update opt-in to false successfully', async () => {
      const existing = {
        add_on_id: 'addon-2',
        public_id: 'pub-ao-5678',
        campaign_id: 'camp-1',
        add_on_name: 'Videography',
        fee: 1000,
        initials: 'VD',
        opt_in: true,
      };

      const updated = { ...existing, opt_in: false };

      mockPrisma.addOns.findFirst.mockResolvedValue(existing);
      mockPrisma.addOns.update.mockResolvedValue(updated);

      const dto: UpdateOptInDTO = { optIn: false };
      const res = await service.updateAddOnOptIn('addon-2', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.addOns.update).toHaveBeenCalledWith({
        where: { add_on_id: 'addon-2' },
        data: { opt_in: false },
      });
    });

    it('should throw NotFoundException when add-on does not exist', async () => {
      mockPrisma.addOns.findFirst.mockResolvedValue(null);
      await expect(
        service.updateAddOnOptIn('missing-addon', { optIn: true }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateAddOnDetails', () => {
    it('should update add-on details successfully', async () => {
      const existing = {
        add_on_id: 'addon-1',
        public_id: 'pub-ao-1234',
        campaign_id: 'camp-1',
        add_on_name: 'Photography',
        description: 'Old description',
        fee: 500,
        initials: 'PH',
        opt_in: false,
      };

      const dto: UpdateAddOnDTO = {
        addOnName: 'Videography',
        description: 'Updated description',
        fee: 1000,
        initials: 'VD',
      };

      const updated = {
        ...existing,
        add_on_name: dto.addOnName,
        description: dto.description,
        fee: dto.fee,
        initials: dto.initials,
      };

      mockPrisma.addOns.findFirst.mockResolvedValue(existing);
      mockPrisma.addOns.update.mockResolvedValue(updated);

      const res = await service.updateAddOnDetails('addon-1', dto);
      expect(res).toEqual(updated);
      expect(mockPrisma.addOns.update).toHaveBeenCalledWith({
        where: { add_on_id: 'addon-1' },
        data: {
          add_on_name: 'Videography',
          description: 'Updated description',
          fee: 1000,
          initials: 'VD',
        },
      });
    });

    it('should throw NotFoundException when add-on does not exist', async () => {
      mockPrisma.addOns.findFirst.mockResolvedValue(null);
      await expect(
        service.updateAddOnDetails('missing-addon', {
          addOnName: 'Updated Add-on',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.addOns.update).not.toHaveBeenCalled();
    });
  });
});
