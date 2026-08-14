jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from 'src/features/campaign/campaigns/campaigns.service';
import { DeliverablesService } from 'src/features/deliverable/deliverables/deliverables.service';
import { FinalAssetsService } from '../final-assets.service';
import { ForbiddenException } from '@nestjs/common';

describe('FinalAssetsService', () => {
  let service: FinalAssetsService;

  const mockPrisma = {
    $transaction: jest.fn(),
    finalAssets: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockCampaignsService = {
    findOneCampaign: jest.fn(),
  };

  const mockDeliverablesService = {
    findOneDeliverableByUID: jest.fn(),
    findDeliverablesForCampaign: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    mockPrisma.$transaction.mockImplementation((cb: any) =>
      Promise.resolve(cb(mockPrisma)),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinalAssetsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CampaignsService, useValue: mockCampaignsService } as any,
        {
          provide: DeliverablesService,
          useValue: mockDeliverablesService,
        } as any,
      ],
    }).compile();

    service = module.get(FinalAssetsService);
  });

  describe('findFinalAssetsForCampaign', () => {
    const campaignId = 'campaign-1';

    const deliverables = [
      {
        deliverable_id: 'del-1',
        public_id: 'pub-del-1',
        campaign_id: campaignId,
      },
      {
        deliverable_id: 'del-2',
        public_id: 'pub-del-2',
        campaign_id: campaignId,
      },
    ];

    const finalAssets = [
      {
        final_asset_id: 'fa-1',
        deliverable_id: 'del-1',
        public_id: 'pub-fa-1',
        file_url: ['https://storage.example.com/assets/video.mp4'],
        created_at: new Date(),
      },
      {
        final_asset_id: 'fa-2',
        deliverable_id: 'del-2',
        public_id: 'pub-fa-2',
        file_url: ['https://storage.example.com/assets/photo.png'],
        created_at: new Date(),
      },
    ];

    it('should group final assets by deliverable public id', async () => {
      mockDeliverablesService.findDeliverablesForCampaign.mockResolvedValue(
        deliverables,
      );
      mockCampaignsService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
        paid_full: true,
      });
      mockPrisma.finalAssets.findMany.mockResolvedValue(finalAssets);

      const result = await service.findFinalAssetsForCampaign(campaignId);

      expect(result).toEqual({
        deliverable_1: {
          deliverablePublicId: 'pub-del-1',
          finalAssets: [finalAssets[0]],
        },
        deliverable_2: {
          deliverablePublicId: 'pub-del-2',
          finalAssets: [finalAssets[1]],
        },
      });
      expect(mockPrisma.finalAssets.findMany).toHaveBeenCalledWith({
        where: {
          deliverable_id: { in: ['del-1', 'del-2'] },
        },
        orderBy: {
          created_at: 'desc',
        },
      });
    });

    it('should return empty arrays for deliverables without final assets', async () => {
      mockDeliverablesService.findDeliverablesForCampaign.mockResolvedValue(
        deliverables,
      );
      mockCampaignsService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
        paid_full: true,
      });
      mockPrisma.finalAssets.findMany.mockResolvedValue([]);

      const result = await service.findFinalAssetsForCampaign(campaignId);

      expect(result).toEqual({
        deliverable_1: {
          deliverablePublicId: 'pub-del-1',
          finalAssets: [],
        },
        deliverable_2: {
          deliverablePublicId: 'pub-del-2',
          finalAssets: [],
        },
      });
    });

    it('should throw ForbiddenException when the campaign is not fully paid', async () => {
      mockDeliverablesService.findDeliverablesForCampaign.mockResolvedValue(
        deliverables,
      );
      mockCampaignsService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
        paid_full: false,
      });

      await expect(
        service.findFinalAssetsForCampaign(campaignId),
      ).rejects.toBeInstanceOf(ForbiddenException);
      expect(mockPrisma.finalAssets.findMany).not.toHaveBeenCalled();
    });

    it('should propagate NotFoundException when the campaign does not exist', async () => {
      mockDeliverablesService.findDeliverablesForCampaign.mockResolvedValue([]);
      mockCampaignsService.findOneCampaign.mockRejectedValue(
        new Error('CAMPAIGN_NOT_FOUND'),
      );

      await expect(
        service.findFinalAssetsForCampaign(campaignId),
      ).rejects.toThrow('CAMPAIGN_NOT_FOUND');
    });
  });
});
