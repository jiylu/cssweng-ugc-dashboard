import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { InvoiceService } from '../invoice.service';
import { CampaignsService } from 'src/features/campaign/campaigns/campaigns.service';
import { CreateInvoiceDTO } from '../dto/create-invoice-dto';
import { CampaignStatus } from '@prisma/client';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-inv-id') }));

describe('InvoiceService', () => {
  let service: InvoiceService;

  const mockPrisma = {
    invoices: {
      create: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvoiceService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignService,
        },
      ],
    }).compile();

    service = module.get<InvoiceService>(InvoiceService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createInvoice', () => {
    it('should create an invoice successfully', async () => {
      const dto: CreateInvoiceDTO = {
        campaignId: 'camp-1',
        invoiceUrl: 'https://example.com/invoice.pdf',
      };

      const mockCampaign = {
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.ACTIVE,
        all_deliverables_approved: true,
        client_id: 'client-1',
        project_name: 'E2E Draft Campaign',
      };

      const mockInvoice = {
        invoice_id: 'invoice-1',
        public_id: 'mock-inv-id',
        campaign_id: 'camp-1',
        invoice_url: dto.invoiceUrl,
        created_at: new Date('2026-08-13T10:00:00.000Z'),
      };

      mockCampaignService.findOneCampaign.mockResolvedValue(mockCampaign);
      mockPrisma.invoices.findFirst.mockResolvedValue(null);
      mockPrisma.invoices.create.mockResolvedValue(mockInvoice);

      const res = await service.createInvoice(dto);
      expect(res).toEqual({
        invoice: mockInvoice,
        client_id: 'client-1',
        project_name: 'E2E Draft Campaign',
      });
      expect(mockPrisma.invoices.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-inv-id',
          campaign_id: 'camp-1',
          invoice_url: dto.invoiceUrl,
        },
      });
    });

    it('should throw ConflictException when an invoice already exists for the campaign', async () => {
      const dto: CreateInvoiceDTO = {
        campaignId: 'camp-1',
        invoiceUrl: 'https://example.com/invoice.pdf',
      };

      const mockCampaign = {
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.ACTIVE,
        all_deliverables_approved: true,
      };

      mockCampaignService.findOneCampaign.mockResolvedValue(mockCampaign);
      mockPrisma.invoices.findFirst.mockResolvedValue({
        invoice_id: 'existing-invoice',
      });

      await expect(service.createInvoice(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
      expect(mockPrisma.invoices.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when campaign is not ACTIVE', async () => {
      const dto: CreateInvoiceDTO = {
        campaignId: 'camp-1',
        invoiceUrl: 'https://example.com/invoice.pdf',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.COMPLETED,
        all_deliverables_approved: true,
      });

      await expect(service.createInvoice(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.invoices.create).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when not all deliverables are approved', async () => {
      const dto: CreateInvoiceDTO = {
        campaignId: 'camp-1',
        invoiceUrl: 'https://example.com/invoice.pdf',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
        campaign_status: CampaignStatus.ACTIVE,
        all_deliverables_approved: false,
      });

      await expect(service.createInvoice(dto)).rejects.toBeInstanceOf(
        BadRequestException,
      );
      expect(mockPrisma.invoices.create).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      const dto: CreateInvoiceDTO = {
        campaignId: 'missing-camp',
        invoiceUrl: 'https://example.com/invoice.pdf',
      };

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createInvoice(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('resolvePublicId', () => {
    it('should resolve an invoice public id to its invoice id', async () => {
      mockPrisma.invoices.findFirst.mockResolvedValue({
        invoice_id: 'invoice-1',
      });

      const res = await service.resolvePublicId('pub-1');
      expect(res).toBe('invoice-1');
      expect(mockPrisma.invoices.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'pub-1' },
        select: { invoice_id: true },
      });
    });

    it('should throw NotFoundException when public id cannot be resolved', async () => {
      mockPrisma.invoices.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findOneInvoice', () => {
    it('should return an invoice when it exists', async () => {
      const mockInvoice = {
        invoice_id: 'invoice-1',
        public_id: 'pub-1',
        campaign_id: 'camp-1',
        invoice_url: 'https://example.com/invoice.pdf',
      };

      mockPrisma.invoices.findFirst.mockResolvedValue(mockInvoice);

      const res = await service.findOneInvoice('invoice-1');
      expect(res).toEqual(mockInvoice);
      expect(mockPrisma.invoices.findFirst).toHaveBeenCalledWith({
        where: { invoice_id: 'invoice-1' },
      });
    });

    it('should throw NotFoundException when invoice does not exist', async () => {
      mockPrisma.invoices.findFirst.mockResolvedValue(null);

      await expect(
        service.findOneInvoice('missing-invoice'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findInvoiceForCampaign', () => {
    it('should return the invoice for a campaign', async () => {
      const mockInvoice = {
        invoice_id: 'invoice-1',
        public_id: 'pub-1',
        campaign_id: 'camp-1',
        invoice_url: 'https://example.com/invoice.pdf',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.invoices.findFirst.mockResolvedValue(mockInvoice);

      const res = await service.findInvoiceForCampaign('camp-1');
      expect(res).toEqual(mockInvoice);
      expect(mockPrisma.invoices.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: 'camp-1' },
      });
    });

    it('should return null when no invoice exists for the campaign', async () => {
      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.invoices.findFirst.mockResolvedValue(null);

      const res = await service.findInvoiceForCampaign('camp-1');
      expect(res).toBeNull();
    });

    it('should throw NotFoundException when campaign does not exist', async () => {
      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.findInvoiceForCampaign('missing-camp'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
