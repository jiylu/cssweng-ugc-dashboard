jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pub-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignSetupService } from '../campaign-setup.service';
import { CampaignsService } from 'src/features/campaign/campaigns/campaigns.service';
import { DeliverablesService } from 'src/features/deliverable/deliverables/deliverables.service';
import { ProposalsService } from 'src/features/campaign/proposals/proposals.service';
import { ProposalHistoryService } from 'src/features/campaign/proposals/proposal-history.service';
import { CreateCampaignRequestDto } from '../dto/create-campaign-request-dto';
import { DeliverableType, PaymentSchedule, Prisma } from '@prisma/client';
import { EmailService } from 'src/shared/email/email.service';
import { ActivityLogService } from 'src/shared/activity-log/activity-log.service';
import { ContractsService } from 'src/features/campaign/contracts/contracts.service';
import { AddOnsService } from 'src/features/campaign/add-ons/add-ons.service';
import { GiftedProductsService } from 'src/features/campaign/gifted-products/gifted-products.service';
import { UpdateCampaignSetupDto } from '../dto/update-campaign-setup.dto';
import { UserService } from 'src/features/user/users/users.service';
import { PAYMENT_SCHEDULE } from 'src/features/campaign/contracts/dto/payment-terms.dto';

describe('CampaignSetupService', () => {
  let service: CampaignSetupService;

  const mockPrisma = {
    $transaction: jest.fn(),
  };

  const mockCampaignService = {
    createCampaign: jest.fn(),
    findOneCampaign: jest.fn(),
    updateCampaignDetails: jest.fn(),
  };

  const mockDeliverableService = {
    createDeliverable: jest.fn(),
    createManyDeliverables: jest.fn(),
    updateDeliverableDetails: jest.fn(),
    deleteDeliverable: jest.fn(),
    findDeliverablesForCampaign: jest.fn(),
  };

  const mockProposalService = {
    createProposal: jest.fn(),
    findProposalByCampaignId: jest.fn(),
    updateProposalStatus: jest.fn(),
    resolvePublicId: jest.fn(),
    findActiveProposal: jest.fn(),
  };

  const mockProposalHistoryService = {
    createProposalHistory: jest.fn().mockResolvedValue({}),
    findLatestVersion: jest.fn(),
  };

  const mockContractService = {
    createContract: jest.fn(),
    updateContractDetails: jest.fn(),
    findContractByCampaignId: jest.fn(),
  };

  const mockAddOnService = {
    createAddOn: jest.fn(),
    createManyAddOns: jest.fn(),
    updateAddOnDetails: jest.fn(),
    deleteAddOn: jest.fn(),
    findAddOnsForCampaign: jest.fn(),
  };

  const mockGiftedProductsService = {
    createGiftedProduct: jest.fn(),
    createManyGiftedProducts: jest.fn(),
    updateGiftedProductDetails: jest.fn(),
    deleteGiftedProduct: jest.fn(),
    findGiftedProductsForCampaign: jest.fn(),
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
          provide: ProposalHistoryService,
          useValue: mockProposalHistoryService,
        } as any,
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
          useValue: mockContractService,
        },
        {
          provide: AddOnsService,
          useValue: mockAddOnService,
        },
        {
          provide: GiftedProductsService,
          useValue: mockGiftedProductsService,
        },
        {
          provide: UserService,
          useValue: {
            findActiveUserByEmail: jest.fn().mockResolvedValue(null),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignSetupService>(CampaignSetupService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getFullCampaignDetailsByProposalPublicId', () => {
    it('returns the latest proposal history comment for client review', async () => {
      const proposal = {
        proposal_id: 'proposal-1',
        campaign_id: 'campaign-1',
        public_id: 'public-1',
      };
      const details = {
        campaign: { campaign_id: 'campaign-1' },
        proposal,
        deliverables: [],
        contract: {},
        addOns: [],
        giftedProducts: [],
      };

      mockProposalService.resolvePublicId.mockResolvedValue('proposal-1');
      mockProposalService.findActiveProposal.mockResolvedValue(proposal);
      mockProposalHistoryService.findLatestVersion.mockResolvedValue({
        client_comments: 'Please revise the delivery schedule.',
      });
      jest
        .spyOn(service, 'getFullCampaignDetails')
        .mockResolvedValue(
          details as unknown as Awaited<
            ReturnType<CampaignSetupService['getFullCampaignDetails']>
          >,
        );

      await expect(
        service.getFullCampaignDetailsByProposalPublicId('public-1'),
      ).resolves.toEqual({
        ...details,
        proposal: {
          ...proposal,
          client_comments: 'Please revise the delivery schedule.',
        },
      });
      expect(mockProposalHistoryService.findLatestVersion).toHaveBeenCalledWith(
        'proposal-1',
      );
    });
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
          platforms: { Instagram: 'true', Tiktok: 'true' },
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
          client_first_name: 'Jane',
          client_last_name: 'Doe',
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
            payment_schedule: PAYMENT_SCHEDULE.NET_30,
            payment_method: 'Bank Transfer',
          },
          invoice_requirements: {
            name: 'Test',
            email: 'test@test.com',
            campaign_name: 'Test',
            payment_details: 'Bank',
          },
          general_terms: {
            governed_by: 'Laws of the Republic of the Philippines',
            disputes_handled_in: 'Makati City courts',
          },
        },
      };

      const totalPrice = 330;

      const mockCampaign = {
        campaign_id: 'camp-1',
        ...dto.campaign,
        pricing: totalPrice,
      };
      const mockProposal = {
        proposal_id: 'prop-1',
        public_id: 'proposal-public-id',
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
        {
          ...dto.campaign,
          pricing: totalPrice,
          paymentSchedule: PaymentSchedule.DEPOSIT_50_FINAL_50,
        },
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
          platforms: { Instagram: 'true', TikTok: 'true' },
          startDate: new Date().toISOString(),
          endDate: new Date().toISOString(),
        },
        deliverables: [],
        proposal: {
          clientEmail: 'client@test.com',
          client_first_name: 'Jane',
          client_last_name: 'Doe',
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
            payment_schedule: PAYMENT_SCHEDULE.NET_30,
            payment_method: 'Bank Transfer',
          },
          invoice_requirements: {
            name: 'Test',
            email: 'test@test.com',
            campaign_name: 'Test',
            payment_details: 'Bank',
          },
          general_terms: {
            governed_by: 'Laws of the Republic of the Philippines',
            disputes_handled_in: 'Makati City courts',
          },
        },
      };

      mockCampaignService.createCampaign.mockRejectedValue(new Error('boom'));

      await expect(service.createFullCampaignService(dto)).rejects.toThrow(
        'boom',
      );
    });
  });

  describe('updateCampaignSetup', () => {
    it('should update campaign setup in one transaction', async () => {
      const tx = { tx: true };
      mockPrisma.$transaction.mockImplementation((cb: any) =>
        Promise.resolve(cb(tx)),
      );

      const campaignId = 'camp-1';
      const dto: UpdateCampaignSetupDto = {
        campaign: {
          projectName: 'Updated Campaign',
          pricing: 5000,
        },
        contract: {
          contractId: 'contract-1',
          extra_notes: 'Updated notes',
        },
        deliverables: {
          create: [
            {
              quantity: 1,
              deliverableType: DeliverableType.UGC,
              deliverableContent: 'TikTok Video',
              requirements:
                'Updated deliverable requirements with enough detail here.',
              dueDate: '2026-07-01T00:00:00.000Z',
              postDate: '2026-07-05T00:00:00.000Z',
              pricing: 1000,
            },
          ],
          update: [
            {
              deliverableId: 'del-1',
              pricing: 1500,
            },
          ],
          delete: ['del-2'],
        },
        giftedProducts: {
          create: [
            {
              productName: 'Vitamin C Serum',
              value: 1500,
              shippingAddress: {
                delivery_address_line_1: '123 Sample St',
                delivery_address_line_2: 'Building 2, Unit 4',
                country: 'Philippines',
                state_province: 'Metro Manila',
                city: 'Makati City',
                zip_code: 1226,
              },
              deliveryInstructions: 'Call before delivery.',
              ownershipTerms: 'Creator keeps product.',
            },
          ],
          update: [
            {
              giftedProductId: 'gp-1',
              value: 1800,
            },
          ],
          delete: ['gp-2'],
        },
        addOns: {
          create: [
            {
              addOnName: 'Extra Story Set',
              description: 'Three additional IG stories',
              fee: 5000,
              initials: 'ESS',
            },
          ],
          update: [
            {
              addOnId: 'addon-1',
              fee: 6500,
            },
          ],
          delete: ['addon-2'],
        },
      };

      const updatedCampaign = { campaign_id: campaignId };
      const updatedContract = { contract_id: 'contract-1' };
      const createdDeliverables = [{ deliverable_id: 'del-new' }];
      const updatedDeliverables = [{ deliverable_id: 'del-1' }];
      const deletedDeliverables = [{ deliverable_id: 'del-2' }];
      const createdGiftedProducts = [{ gifted_product_id: 'gp-new' }];
      const updatedGiftedProducts = [{ gifted_product_id: 'gp-1' }];
      const deletedGiftedProducts = [{ gifted_product_id: 'gp-2' }];
      const createdAddOns = [{ add_on_id: 'addon-new' }];
      const updatedAddOns = [{ add_on_id: 'addon-1' }];
      const deletedAddOns = [{ add_on_id: 'addon-2' }];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
        tax: new Prisma.Decimal(10),
      });
      mockCampaignService.updateCampaignDetails.mockResolvedValue(
        updatedCampaign,
      );
      mockContractService.updateContractDetails.mockResolvedValue(
        updatedContract,
      );
      mockDeliverableService.createManyDeliverables.mockResolvedValue(
        createdDeliverables,
      );
      mockDeliverableService.updateDeliverableDetails.mockResolvedValue(
        updatedDeliverables[0],
      );
      mockDeliverableService.deleteDeliverable.mockResolvedValue(
        deletedDeliverables[0],
      );
      mockGiftedProductsService.createManyGiftedProducts.mockResolvedValue(
        createdGiftedProducts,
      );
      mockGiftedProductsService.updateGiftedProductDetails.mockResolvedValue(
        updatedGiftedProducts[0],
      );
      mockGiftedProductsService.deleteGiftedProduct.mockResolvedValue(
        deletedGiftedProducts[0],
      );
      mockAddOnService.createManyAddOns.mockResolvedValue(createdAddOns);
      mockAddOnService.updateAddOnDetails.mockResolvedValue(updatedAddOns[0]);
      mockAddOnService.deleteAddOn.mockResolvedValue(deletedAddOns[0]);

      mockProposalService.findProposalByCampaignId.mockResolvedValue({
        proposal_id: 'prop-1',
        proposal_status: 'FOR_REVISION',
      });
      mockProposalService.updateProposalStatus.mockResolvedValue({
        proposal_id: 'prop-1',
        proposal_status: 'PENDING',
      });
      mockContractService.findContractByCampaignId.mockResolvedValue(
        updatedContract,
      );
      mockDeliverableService.findDeliverablesForCampaign.mockResolvedValue([
        { pricing: new Prisma.Decimal(500) },
        { pricing: new Prisma.Decimal(550) },
      ]);
      mockGiftedProductsService.findGiftedProductsForCampaign.mockResolvedValue(
        [],
      );

      const res = await service.updateCampaignSetup(campaignId, dto);

      expect(res).toEqual({
        campaign: updatedCampaign,
        contract: updatedContract,
        deliverables: {
          created: createdDeliverables,
          updated: updatedDeliverables,
          deleted: deletedDeliverables,
        },
        giftedProducts: {
          created: createdGiftedProducts,
          updated: updatedGiftedProducts,
          deleted: deletedGiftedProducts,
        },
        addOns: {
          created: createdAddOns,
          updated: updatedAddOns,
          deleted: deletedAddOns,
        },
      });
      expect(mockCampaignService.findOneCampaign).toHaveBeenCalledWith(
        campaignId,
        tx,
      );
      expect(mockCampaignService.updateCampaignDetails).toHaveBeenCalledWith(
        campaignId,
        dto.campaign,
        tx,
      );
      expect(mockCampaignService.updateCampaignDetails).toHaveBeenCalledWith(
        campaignId,
        { pricing: 1155 },
        tx,
      );
      expect(mockContractService.updateContractDetails).toHaveBeenCalledWith(
        'contract-1',
        dto.contract,
        tx,
      );
      expect(
        mockDeliverableService.createManyDeliverables,
      ).toHaveBeenCalledWith(
        campaignId,
        [{ ...dto.deliverables?.create?.[0], campaignId }],
        tx,
      );
      expect(
        mockDeliverableService.updateDeliverableDetails,
      ).toHaveBeenCalledWith('del-1', dto.deliverables?.update?.[0], tx);
      expect(mockDeliverableService.deleteDeliverable).toHaveBeenCalledWith(
        'del-2',
        tx,
      );
      expect(
        mockGiftedProductsService.createManyGiftedProducts,
      ).toHaveBeenCalledWith(
        campaignId,
        [{ ...dto.giftedProducts?.create?.[0], campaignId }],
        tx,
      );
      expect(
        mockGiftedProductsService.updateGiftedProductDetails,
      ).toHaveBeenCalledWith('gp-1', dto.giftedProducts?.update?.[0], tx);
      expect(
        mockGiftedProductsService.deleteGiftedProduct,
      ).toHaveBeenCalledWith('gp-2', tx);
      expect(mockAddOnService.createManyAddOns).toHaveBeenCalledWith(
        campaignId,
        [{ ...dto.addOns?.create?.[0], campaignId }],
        tx,
      );
      expect(mockAddOnService.updateAddOnDetails).toHaveBeenCalledWith(
        'addon-1',
        dto.addOns?.update?.[0],
        tx,
      );
      expect(mockAddOnService.deleteAddOn).toHaveBeenCalledWith('addon-2', tx);
      expect(mockProposalService.findProposalByCampaignId).toHaveBeenCalledWith(
        campaignId,
        false,
        tx,
      );
      expect(mockProposalService.updateProposalStatus).toHaveBeenCalledWith(
        'prop-1',
        { proposalStatus: 'PENDING' },
        tx,
      );
    });
  });
});
