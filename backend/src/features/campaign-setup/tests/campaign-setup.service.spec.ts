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
          startDate: new Date('2026-06-10T00:00:00Z').toISOString(),
          endDate: new Date('2026-06-20T00:00:00Z').toISOString(),
        },
        deliverables: [
          {
            deliverableTitle: 'D1',
            description: 'Long enough description for d1',
            deadline: new Date('2026-06-15T00:00:00Z').toISOString(),
            pricing: 100,
            deliverableType: DeliverableType.COLLABORATION,
          },
          {
            deliverableTitle: 'D2',
            description: 'Long enough description for d2',
            deadline: new Date('2026-06-16T00:00:00Z').toISOString(),
            pricing: 200,
            deliverableType: DeliverableType.UGC,
          },
        ],
        proposal: {
          clientEmail: 'client@test.com',
        },
      };

      const totalPrice = 100 + 200;

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
      mockDeliverableService.createDeliverable
        .mockResolvedValueOnce(mockDeliverable(1))
        .mockResolvedValueOnce(mockDeliverable(2));

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

      expect(mockDeliverableService.createDeliverable).toHaveBeenCalledTimes(2);
      expect(mockDeliverableService.createDeliverable).toHaveBeenCalledWith(
        { ...dto.deliverables[0], campaignId: mockCampaign.campaign_id },
        {},
      );
    });

    it('should propagate errors from campaign creation', async () => {
      const dto: CreateCampaignRequestDto = {
        campaign: {
          ugcId: 'ugc-1',
          projectName: 'Test Project',
          description: 'A project for testing',
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        deliverables: [],
        proposal: { clientEmail: 'client@test.com' },
      };

      mockCampaignService.createCampaign.mockRejectedValue(new Error('boom'));

      await expect(service.createFullCampaignService(dto)).rejects.toThrow(
        'boom',
      );
    });
  });
});
