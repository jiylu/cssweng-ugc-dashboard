jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pub-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignSetupService } from '../campaign-setup.service';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { DeliverablesService } from 'src/features/deliverables/deliverables.service';
import { ProposalsService } from 'src/features/proposals/proposals.service';
import { CreateCampaignRequestDto } from '../dto/create-campaign-request-dto';
import { DeliverableType } from '@prisma/client';
import { EmailService } from 'src/features/email/email.service';
import { ActivityLogService } from 'src/features/activity-log/activity-log.service';
import { ContractsService } from 'src/features/contracts/contracts.service';
import { AddOnsService } from 'src/features/add-ons/add-ons.service';
import { GiftedProductsService } from 'src/features/gifted-products/gifted-products.service';

describe('CampaignSetupService', () => {
  let service: CampaignSetupService;

  const mockPrisma = {
    $transaction: jest.fn(),
  };

  const mockCampaignService = {
    createCampaign: jest.fn(),
  };

  const mockDeliverableService = {
    createDeliverable: jest.fn(),
    createManyDeliverables: jest.fn(),
  };

  const mockProposalService = {
    createProposal: jest.fn(),
  };

  beforeEach(async () => {
    mockPrisma.$transaction.mockImplementation((cb: any) =>
      Promise.resolve(cb({})),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignSetupService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: CampaignsService, useValue: mockCampaignService } as any,
        {
          provide: DeliverablesService,
          useValue: mockDeliverableService,
        } as any,
        { provide: ProposalsService, useValue: mockProposalService } as any,
        {
          provide: EmailService,
          useValue: {
            sendProposalReminderEmail: jest.fn().mockResolvedValue(null),
          },
        },
        {
          provide: ActivityLogService,
          useValue: { createActivityLog: jest.fn() },
        },
        {
          provide: ContractsService,
          useValue: { createContract: jest.fn() },
        },
        {
          provide: AddOnsService,
          useValue: { createAddOn: jest.fn(), createManyAddOns: jest.fn() },
        },
        {
          provide: GiftedProductsService,
          useValue: {
            createGiftedProduct: jest.fn(),
            createManyGiftedProducts: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignSetupService>(CampaignSetupService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createFullCampaignService', () => {
    it('should create campaign, proposal and deliverables and return them', async () => {
      const dto: CreateCampaignRequestDto = {
        campaign: {
          ugcId: 'ugc-1',
          projectName: 'Test Project',
          description: 'A project for testing',
          currency: 'PHP',
          tax: 10,
          platforms: ['Instagram', 'Tiktok'],
          startDate: new Date('2026-06-10T00:00:00Z').toISOString(),
          endDate: new Date('2026-06-20T00:00:00Z').toISOString(),
        },
        deliverables: [
          {
            quantity: 2,
            deliverableType: DeliverableType.COLLABORATION,
            deliverableContent: 'Instagram Reels',
            requirements: 'Long enough description for d1',
            dueDate: new Date('2026-06-15T00:00:00Z').toISOString(),
            postDate: new Date('2026-06-16T00:00:00Z').toISOString(),
            pricing: 100,
          },
          {
            quantity: 3,
            deliverableType: DeliverableType.UGC,
            deliverableContent: 'Tiktok Reels',
            requirements: 'Long enough description for d2',
            dueDate: new Date('2026-06-16T00:00:00Z').toISOString(),
            postDate: new Date('2026-06-16T00:00:00Z').toISOString(),
            pricing: 200,
          },
        ],
        proposal: {
          clientEmail: 'client@test.com',
        },
        contract: {
          revision_policy: {
            revision_rounds: 3,
            revision_window_days: 7,
            auto_approve_after_days: 5,
          },
          usage_rights: {
            is_exclusive: true,
            is_transferrable: false,
            organic_usage:
              'Brand may repost creator content on owned channels.',
            territory: 'Worldwide',
            restrictions: 'None',
          },
          posting_requirements: {
            content_retention_months: 12,
            partnership_tags: '#ad',
          },
          cancellation_period: 30,
          payment_terms: {
            payment_schedule: 1,
            payment_method: 'Bank Transfer',
          },
          invoice_requirements: {
            name: 'Test',
            email: 'test@test.com',
            campaign_name: 'Test',
            payment_details: 'Bank',
          },
        },
      };

      const totalPrice = 300 + 300 * (10 / 100);

      const mockCampaign = {
        campaign_id: 'camp-1',
        ...dto.campaign,
        pricing: totalPrice,
      };
      const mockProposal = {
        proposal_id: 'prop-1',
        campaignId: mockCampaign.campaign_id,
        clientEmail: dto.proposal.clientEmail,
      };
      const mockDeliverable = (i: number) => ({
        deliverable_id: `d-${i}`,
        campaign_id: mockCampaign.campaign_id,
        ...dto.deliverables[i - 1],
      });

      mockCampaignService.createCampaign.mockResolvedValue(mockCampaign);
      mockProposalService.createProposal.mockResolvedValue(mockProposal);
      mockDeliverableService.createManyDeliverables.mockResolvedValue([
        mockDeliverable(1),
        mockDeliverable(2),
      ]);

      const res = await service.createFullCampaignService(dto);

      expect(res).toHaveProperty('campaign', mockCampaign);
      expect(res).toHaveProperty('proposal', mockProposal);
      expect(res).toHaveProperty('deliverables');
      expect(res.deliverables).toEqual([
        mockDeliverable(1),
        mockDeliverable(2),
      ]);

      expect(mockPrisma.$transaction).toHaveBeenCalled();

      expect(mockCampaignService.createCampaign).toHaveBeenCalledWith(
        { ...dto.campaign, pricing: totalPrice },
        {},
      );

      expect(mockProposalService.createProposal).toHaveBeenCalledWith(
        { ...dto.proposal, campaignId: mockCampaign.campaign_id },
        {},
      );

      expect(
        mockDeliverableService.createManyDeliverables,
      ).toHaveBeenCalledTimes(1);
      expect(
        mockDeliverableService.createManyDeliverables,
      ).toHaveBeenCalledWith(
        mockCampaign.campaign_id,
        dto.deliverables.map((d) => ({
          ...d,
          campaignId: mockCampaign.campaign_id,
        })),
        {},
      );
    });

    it('should propagate errors from campaign creation', async () => {
      const dto: CreateCampaignRequestDto = {
        campaign: {
          ugcId: 'ugc-1',
          projectName: 'Test Project',
          description: 'A project for testing',
          currency: 'PHP',
          tax: 10,
          platforms: ['Instagram', 'TikTok'],
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        deliverables: [],
        proposal: { clientEmail: 'client@test.com' },
        contract: {
          revision_policy: {
            revision_rounds: 3,
            revision_window_days: 7,
            auto_approve_after_days: 5,
          },
          usage_rights: {
            is_exclusive: true,
            is_transferrable: false,
            organic_usage:
              'Brand may repost creator content on owned channels.',
            territory: 'Worldwide',
            restrictions: 'None',
          },
          posting_requirements: {
            content_retention_months: 12,
            partnership_tags: '#ad',
          },
          cancellation_period: 30,
          payment_terms: {
            payment_schedule: 1,
            payment_method: 'Bank Transfer',
          },
          invoice_requirements: {
            name: 'Test',
            email: 'test@test.com',
            campaign_name: 'Test',
            payment_details: 'Bank',
          },
        },
      };

      mockCampaignService.createCampaign.mockRejectedValue(new Error('boom'));

      await expect(service.createFullCampaignService(dto)).rejects.toThrow(
        'boom',
      );
    });
  });
});
