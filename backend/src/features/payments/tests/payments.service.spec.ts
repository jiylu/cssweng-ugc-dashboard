import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { PaymentsService } from '../payments.service';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { ProposalsService } from 'src/features/proposals/proposals.service';
import { CreatePaymentDTO } from '../dto/create-payment.dto';
import {
  CampaignStatus,
  PaymentSchedule,
  ProposalStatus,
} from '@prisma/client';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

describe('PaymentsService', () => {
  let service: PaymentsService;

  const mockPrisma = {
    payments: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
    updateCampaignStatus: jest.fn(),
    updatePaidAmount: jest.fn(),
  };

  const mockProposalsService = {
    findProposalByCampaignId: jest.fn(),
  };

  beforeEach(async () => {
    mockPrisma.$transaction.mockImplementation(async (callback: any) =>
      callback(mockPrisma),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignService,
        },
        {
          provide: ProposalsService,
          useValue: mockProposalsService,
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const dto: CreatePaymentDTO = {
        campaignId: 'camp-1',
        proofPaymentUrl: 'https://example.com/proof.png',
      };

      const mockCampaign = {
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.ACTIVE,
        all_deliverables_approved: true,
        ugc_creator_id: 'creator-1',
        client_id: 'client-1',
        project_name: 'E2E Draft Campaign',
      };

      const mockPayment = {
        payment_id: 'payment-1',
        public_id: 'mock-pb-id',
        campaign_id: 'camp-1',
        proof_payment_url: dto.proofPaymentUrl,
        is_payment_verified: false,
      };

      mockCampaignService.findOneCampaign.mockResolvedValue(mockCampaign);
      mockPrisma.payments.create.mockResolvedValue(mockPayment);

      const res = await service.createPayment(dto);
      expect(res).toEqual({
        recordedPayment: mockPayment,
        creator_id: 'creator-1',
        project_name: 'E2E Draft Campaign',
      });
      expect(mockPrisma.payments.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-pb-id',
          campaign_id: 'camp-1',
          proof_payment_url: dto.proofPaymentUrl,
        },
      });
    });

    it('should throw BadRequestException when campaign is not ACTIVE', async () => {
      const dto: CreatePaymentDTO = {
        campaignId: 'camp-1',
        proofPaymentUrl: 'https://example.com/proof.png',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.COMPLETED,
      });

      await expect(service.createPayment(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.payments.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      const dto: CreatePaymentDTO = {
        campaignId: 'missing-camp',
        proofPaymentUrl: 'https://example.com/proof.png',
      };

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createPayment(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('resolvePublicId', () => {
    it('should resolve a payment public id to its payment id', async () => {
      mockPrisma.payments.findFirst.mockResolvedValue({
        payment_id: 'payment-1',
      });

      const res = await service.resolvePublicId('pub-1');
      expect(res).toBe('payment-1');
      expect(mockPrisma.payments.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'pub-1' },
        select: { payment_id: true },
      });
    });

    it('should throw NotFoundException when public id cannot be resolved', async () => {
      mockPrisma.payments.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findOnePaymentRecord', () => {
    it('should return a payment when it exists', async () => {
      const mockPayment = {
        payment_id: 'payment-1',
        public_id: 'pub-1',
        campaign_id: 'camp-1',
        proof_payment_url: 'https://example.com/proof.png',
        is_payment_verified: false,
      };

      mockPrisma.payments.findFirst.mockResolvedValue(mockPayment);

      const res = await service.findOnePaymentRecord('payment-1');
      expect(res).toEqual(mockPayment);
      expect(mockPrisma.payments.findFirst).toHaveBeenCalledWith({
        where: { payment_id: 'payment-1' },
      });
    });

    it('should throw NotFoundException when payment does not exist', async () => {
      mockPrisma.payments.findFirst.mockResolvedValue(null);

      await expect(
        service.findOnePaymentRecord('missing-payment'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findPaymentForCampaign', () => {
    it('should return the latest payment for a campaign', async () => {
      const campaignId = 'camp-1';
      const mockPayment = {
        payment_id: 'payment-2',
        public_id: 'pub-2',
        campaign_id: campaignId,
        proof_payment_url: 'https://example.com/proof.png',
        is_payment_verified: false,
        created_at: new Date('2026-08-12T00:00:00Z'),
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.payments.findFirst.mockResolvedValue(mockPayment);

      const res = await service.findPaymentForCampaign(campaignId);
      expect(res).toEqual(mockPayment);
      expect(mockPrisma.payments.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: campaignId },
        orderBy: { created_at: 'desc' },
      });
    });

    it('should return null when no payment exists for the campaign', async () => {
      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.payments.findFirst.mockResolvedValue(null);

      const res = await service.findPaymentForCampaign('camp-1');
      expect(res).toBeNull();
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.findPaymentForCampaign('missing-camp'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('validatePayment', () => {
    it('should validate a payment successfully', async () => {
      const existing = {
        payment_id: 'payment-1',
        public_id: 'pub-1',
        campaign_id: 'camp-1',
        proof_payment_url: 'https://example.com/proof.png',
        is_payment_verified: false,
      };

      const validated = { ...existing, is_payment_verified: true };

      mockPrisma.payments.findFirst.mockResolvedValue(existing);
      mockPrisma.payments.update.mockResolvedValue(validated);
      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
        client_id: 'client-1',
        project_name: 'Test Campaign',
        payment_schedule: PaymentSchedule.DUE_FINAL_DELIVERY,
        pricing: { toNumber: () => 5000 },
      });
      mockProposalsService.findProposalByCampaignId.mockResolvedValue({
        proposal_id: 'proposal-1',
        proposal_status: ProposalStatus.ACCEPTED,
      });
      mockCampaignService.updateCampaignStatus.mockResolvedValue({});
      mockCampaignService.updatePaidAmount.mockResolvedValue({});

      const res = await service.validatePayment('payment-1');
      expect(res).toEqual({
        validatedPayment: validated,
        client_id: 'client-1',
        project_name: 'Test Campaign',
      });
      expect(mockPrisma.payments.update).toHaveBeenCalledWith({
        where: { payment_id: 'payment-1' },
        data: {
          is_payment_verified: true,
          verified_at: expect.any(Date),
        },
      });
      expect(mockCampaignService.updateCampaignStatus).toHaveBeenCalledWith(
        'camp-1',
        { campaignStatus: CampaignStatus.COMPLETED },
        mockPrisma,
      );
      expect(mockCampaignService.updatePaidAmount).toHaveBeenCalledWith(
        'camp-1',
        { paidAmount: 5000 },
        mockPrisma,
      );
    });

    it('should throw NotFoundException when payment does not exist', async () => {
      mockPrisma.payments.findFirst.mockResolvedValue(null);

      await expect(service.validatePayment('missing-payment')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
