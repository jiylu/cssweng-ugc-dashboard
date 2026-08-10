import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ContractsService } from '../contracts.service';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { CreateContractDTO } from '../dto/create-contract.dto';
import { PAYMENT_SCHEDULE } from '../dto/payment-terms.dto';
import { UpdateContractDTO } from '../dto/update-contract.dto';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

describe('ContractsService', () => {
  let service: ContractsService;

  const mockPrisma = {
    $transaction: jest.fn((callback) => callback(mockPrisma)),
    contracts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findUniqueOrThrow: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
  };

  beforeEach(async () => {
    mockPrisma.$transaction.mockImplementation((callback) =>
      callback(mockPrisma),
    );

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractsService,
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

    service = module.get<ContractsService>(ContractsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
    // Re-set nanoid mock after resetAllMocks clears implementations
    const { nanoid } = require('nanoid');
    (nanoid as jest.Mock).mockReturnValue('mock-pb-id');
  });

  // ── Shared test data helpers ──────────────────────────────────────

  const buildCreateContractDTO = (
    overrides?: Partial<CreateContractDTO>,
  ): CreateContractDTO => ({
    campaignId: 'camp-1',
    revision_policy: {
      revision_rounds: 3,
      revision_window_days: 7,
      auto_approve_after_days: 5,
    },
    usage_rights: {
      is_exclusive: true,
      is_transferrable: false,
      organic_usage:
        'Brand may repost creator content on owned social media channels organically.',
      paid_usage_ads:
        'Brand may use creator content in paid advertisements across platforms.',
      whitelisting_spark_ads:
        'Brand may run whitelisting or spark ads using the creator handle.',
      territory: 'Worldwide',
      restrictions: 'No modifications without approval',
    },
    posting_requirements: {
      content_retention_months: 12,
      partnership_tags: '#ad #sponsored',
    },
    cancellation_period: 30,
    payment_terms: {
      payment_schedule: PAYMENT_SCHEDULE.NET_30,
      payment_method: 'Bank Transfer',
    },
    invoice_requirements: {
      name: 'John Doe',
      email: 'john@example.com',
      campaign_name: 'Summer Campaign 2026',
      tax_number: '123-456-789',
      payment_details: 'BDO Savings 001234567890',
    },
    general_terms: {
      governed_by: 'Laws of the Republic of the Philippines',
      disputes_handled_in: 'Makati City courts',
    },
    ...overrides,
  });

  const buildMockContract = (dto: CreateContractDTO) => ({
    contract_id: 'contract-1',
    public_id: 'mock-pb-id',
    campaign_id: dto.campaignId,
    creator_signed: false,
    client_signed: false,
    signed_at: null,
    revision_policy: { ...dto.revision_policy },
    usage_rights: { ...dto.usage_rights },
    posting_requirements: { ...dto.posting_requirements },
    exclusivity: dto.exclusivity ? { ...dto.exclusivity } : null,
    expenses_purchases_terms: dto.expenses_purchases_terms
      ? { ...dto.expenses_purchases_terms }
      : null,
    cancellation_period: dto.cancellation_period,
    payment_terms: { ...dto.payment_terms },
    invoice_requirements: { ...dto.invoice_requirements },
    general_terms: { ...dto.general_terms },
  });

  // ── createContract ────────────────────────────────────────────────

  describe('createContract', () => {
    it('should create a contract successfully with required fields only', async () => {
      const dto = buildCreateContractDTO();
      const mockContract = buildMockContract(dto);

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.contracts.create.mockResolvedValue(mockContract);

      const res = await service.createContract(dto);
      expect(res).toEqual(mockContract);
      expect(mockCampaignService.findOneCampaign).toHaveBeenCalledWith(
        dto.campaignId,
        mockPrisma,
      );
      expect(mockPrisma.contracts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-pb-id',
          campaign_id: dto.campaignId,
          revision_policy: { ...dto.revision_policy },
          usage_rights: { ...dto.usage_rights },
          posting_requirements: { ...dto.posting_requirements },
          exclusivity: undefined,
          expenses_purchases_terms: undefined,
          cancellation_period: dto.cancellation_period,
          payment_terms: { ...dto.payment_terms },
          invoice_requirements: { ...dto.invoice_requirements },
          general_terms: { ...dto.general_terms },
          extra_notes: undefined,
        },
      });
    });

    it('should create a contract with optional exclusivity', async () => {
      const dto = buildCreateContractDTO({
        exclusivity: {
          category: 'Skincare',
          startDate: '2026-08-01T00:00:00.000Z',
          endDate: '2026-08-01T00:00:00.000Z',
          territory: 'Philippines',
          brandlist: 'Brand A, Brand B',
          exclusivity_fee: 5000,
        },
      });
      const mockContract = buildMockContract(dto);

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.contracts.create.mockResolvedValue(mockContract);

      const res = await service.createContract(dto);
      expect(res).toEqual(mockContract);
      expect(mockPrisma.contracts.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          exclusivity: { ...dto.exclusivity },
        }),
      });
    });

    it('should create a contract with optional expenses_purchases_terms', async () => {
      const dto = buildCreateContractDTO({
        expenses_purchases_terms: {
          reimbursement_period: 14,
          gifted_product_terms: 'Creator keeps all gifted products',
        },
      });
      const mockContract = buildMockContract(dto);

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.contracts.create.mockResolvedValue(mockContract);

      const res = await service.createContract(dto);
      expect(res).toEqual(mockContract);
      expect(mockPrisma.contracts.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          expenses_purchases_terms: { ...dto.expenses_purchases_terms },
        }),
      });
    });

    it('should create a contract with all optional fields', async () => {
      const dto = buildCreateContractDTO({
        exclusivity: {
          category: 'Tech',
          startDate: '2025-01-01',
          endDate: '2025-12-31',
          territory: 'Global',
          brandlist: 'Brand X',
          exclusivity_fee: 500,
        },
        expenses_purchases_terms: {
          reimbursement_period: 30,
          gifted_product_terms: 'Return after campaign',
        },
      });
      const mockContract = buildMockContract(dto);

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.contracts.create.mockResolvedValue(mockContract);

      const res = await service.createContract(dto);
      expect(res).toEqual(mockContract);
      expect(mockPrisma.contracts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-pb-id',
          campaign_id: dto.campaignId,
          revision_policy: { ...dto.revision_policy },
          usage_rights: { ...dto.usage_rights },
          posting_requirements: { ...dto.posting_requirements },
          exclusivity: { ...dto.exclusivity },
          expenses_purchases_terms: { ...dto.expenses_purchases_terms },
          cancellation_period: dto.cancellation_period,
          payment_terms: { ...dto.payment_terms },
          invoice_requirements: { ...dto.invoice_requirements },
          general_terms: { ...dto.general_terms },
          extra_notes: undefined,
        },
      });
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      const dto = buildCreateContractDTO({ campaignId: 'missing-camp' });

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createContract(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.contracts.create).not.toHaveBeenCalled();
    });

    it('should reject on invalid inputs', async () => {
      const dto = buildCreateContractDTO();

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });
      mockPrisma.contracts.create.mockRejectedValue(new Error('Invalid input'));

      await expect(service.createContract(dto)).rejects.toThrow(
        'Invalid input',
      );
    });

    it('should use the provided transaction client', async () => {
      const dto = buildCreateContractDTO();
      const mockContract = buildMockContract(dto);

      const mockTx = {
        contracts: { create: jest.fn().mockResolvedValue(mockContract) },
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: dto.campaignId,
      });

      const res = await service.createContract(dto, mockTx as any);
      expect(res).toEqual(mockContract);
      expect(mockCampaignService.findOneCampaign).toHaveBeenCalledWith(
        dto.campaignId,
        mockTx,
      );
      expect(mockTx.contracts.create).toHaveBeenCalled();
      expect(mockPrisma.contracts.create).not.toHaveBeenCalled();
    });
  });

  // ── findContractByUID ─────────────────────────────────────────────

  describe('findContractByUID', () => {
    it('should return a contract when it exists', async () => {
      const mockContract = {
        contract_id: 'contract-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        creator_signed: false,
        client_signed: false,
        signed_at: null,
        revision_policy: { revision_rounds: 3 },
        cancellation_period: 30,
      };

      mockPrisma.contracts.findFirst.mockResolvedValue(mockContract);

      const res = await service.findContractByUID('contract-1');
      expect(res).toEqual(mockContract);
      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { contract_id: 'contract-1' },
      });
    });

    it('should throw NotFoundException when contract does not exist', async () => {
      mockPrisma.contracts.findFirst.mockResolvedValue(null);
      await expect(
        service.findContractByUID('missing-contract'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ── findContractByPublicId ────────────────────────────────────────

  describe('findContractByPublicId', () => {
    it('should return a contract when found by public ID', async () => {
      const mockContract = {
        contract_id: 'contract-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        creator_signed: false,
        client_signed: false,
        signed_at: null,
        revision_policy: { revision_rounds: 3 },
        cancellation_period: 30,
      };

      mockPrisma.contracts.findFirst.mockResolvedValue(mockContract);

      const res = await service.findContractByPublicId('abc1234567');
      expect(res).toEqual(mockContract);
      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'abc1234567' },
      });
    });

    it('should throw NotFoundException when public ID not found', async () => {
      mockPrisma.contracts.findFirst.mockResolvedValue(null);
      await expect(
        service.findContractByPublicId('nonexistent'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findContractByCampaignId', () => {
    it('should return a contract when found by campaign ID', async () => {
      const mockContract = {
        contract_id: 'contract-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        creator_signed: false,
        client_signed: false,
        signed_at: null,
        revision_policy: { revision_rounds: 3 },
        cancellation_period: 30,
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.contracts.findFirst.mockResolvedValue(mockContract);

      const res = await service.findContractByCampaignId('camp-1');
      expect(res).toEqual(mockContract);
      expect(mockCampaignService.findOneCampaign).toHaveBeenCalledWith(
        'camp-1',
        mockPrisma,
      );
      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: 'camp-1' },
      });
    });

    it('should throw NotFoundException when no contract exists for campaign', async () => {
      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.contracts.findFirst.mockResolvedValue(null);

      await expect(
        service.findContractByCampaignId('camp-1'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ── signContract ──────────────────────────────────────────────────

  describe('signContract', () => {
    it('should sign an unsigned contract successfully', async () => {
      const unsignedContract = {
        contract_id: 'contract-1',
        public_id: 'abc1234567',
        campaign_id: 'camp-1',
        creator_signed: false,
        client_signed: false,
        signed_at: null,
      };

      const signedContract = {
        ...unsignedContract,
        client_signed: true,
      };

      mockPrisma.contracts.findFirst.mockResolvedValue(unsignedContract);
      mockPrisma.contracts.update.mockResolvedValue(signedContract);

      const res = await service.signContract('abc1234567', 'CLIENT' as any);
      
      expect(res).toEqual(signedContract);
      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { contract_id: 'abc1234567' },
      });
      expect(mockPrisma.contracts.update).toHaveBeenCalledWith({
        where: { contract_id: 'contract-1' },
        data: { client_signed: true },
      });
    });

    it('should throw NotFoundException when contract to sign does not exist', async () => {
      mockPrisma.contracts.findFirst.mockResolvedValue(null);

      await expect(
        service.signContract('nonexistent', 'CLIENT' as any),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.contracts.update).not.toHaveBeenCalled();
    });
  });

  describe('updateContractDetails', () => {
    it('should update provided contract fields successfully', async () => {
      const existingContract = {
        contract_id: 'contract-1',
        campaign_id: 'camp-1',
      };
      const dto: UpdateContractDTO = {
        cancellation_period: 14,
        payment_terms: {
          payment_schedule: PAYMENT_SCHEDULE.NET_15,
          payment_method: 'GCash',
        },
        extra_notes: 'Updated terms',
      };
      const updatedContract = {
        ...existingContract,
        cancellation_period: 14,
        payment_terms: {
          payment_schedule: PAYMENT_SCHEDULE.NET_15,
          payment_method: 'GCash',
        },
        extra_notes: 'Updated terms',
      };

      mockPrisma.contracts.findFirst.mockResolvedValue(existingContract);
      mockPrisma.contracts.update.mockResolvedValue(updatedContract);

      const res = await service.updateContractDetails('contract-1', dto);

      expect(res).toEqual(updatedContract);
      expect(mockPrisma.contracts.update).toHaveBeenCalledWith({
        where: { contract_id: 'contract-1' },
        data: {
          cancellation_period: 14,
          payment_terms: {
            payment_schedule: PAYMENT_SCHEDULE.NET_15,
            payment_method: 'GCash',
          },
          extra_notes: 'Updated terms',
        },
      });
    });

    it('should throw NotFoundException when contract does not exist', async () => {
      mockPrisma.contracts.findFirst.mockResolvedValue(null);

      await expect(
        service.updateContractDetails('missing-contract', {
          cancellation_period: 21,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.contracts.update).not.toHaveBeenCalled();
    });
  });

  describe('resolvePublicId', () => {
    it('should return the contract_id for a valid publicId', async () => {
      const publicId = 'pub_valid_1';
      const mockResult = { contract_id: 'contract_internal_1' };

      mockPrisma.contracts.findFirst.mockResolvedValue(mockResult);

      const res = await service.resolvePublicId(publicId);

      expect(res).toBe('contract_internal_1');
      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId },
        select: { contract_id: true },
      });
    });

    it('should throw NotFoundException when no contract matches the publicId', async () => {
      const publicId = 'pub_missing';

      mockPrisma.contracts.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId(publicId)).rejects.toBeInstanceOf(
        NotFoundException,
      );

      expect(mockPrisma.contracts.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId },
        select: { contract_id: true },
      });
    });

    it('should only select contract_id and not return the full contract object', async () => {
      const publicId = 'pub_select_check';

      mockPrisma.contracts.findFirst.mockResolvedValue({
        contract_id: 'contract_select_check',
      });

      const res = await service.resolvePublicId(publicId);

      expect(typeof res).toBe('string');
      expect(res).toBe('contract_select_check');
    });
  });
});
