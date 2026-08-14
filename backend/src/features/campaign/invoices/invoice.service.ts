import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateInvoiceDTO } from './dto/create-invoice-dto';
import { Campaigns, CampaignStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class InvoiceService {
  private readonly logger = new Logger(InvoiceService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
  ) {}

  async createInvoice(dto: CreateInvoiceDTO) {
    this.logger.debug(`Storing invoice for campaign ${dto.campaignId}`);

    const campaign = await this.campaignsService.findOneCampaign(
      dto.campaignId,
    );

    this.assertCampaignCanBeInvoiced(campaign);

    const existingInvoice = await this.prisma.invoices.findFirst({
      where: {
        campaign_id: campaign.campaign_id,
      },
    });

    if (existingInvoice) {
      this.logger.warn(
        `Attempted to store a duplicate invoice for campaign ${campaign.campaign_id}.`,
      );

      throw new ConflictException({
        code: 'INVOICE_ALREADY_EXISTS',
        message: `An invoice already exists for this campaign.`,
      });
    }

    const invoice = await this.prisma.invoices.create({
      data: {
        public_id: nanoid(10),
        campaign_id: campaign.campaign_id,
        invoice_url: dto.invoiceUrl,
      },
    });

    this.logger.log(
      `Stored invoice ${invoice.invoice_id} for ${campaign.campaign_id}`,
    );

    return {
      invoice,
      client_id: campaign.client_id,
      project_name: campaign.project_name,
    };
  }

  async resolvePublicId(publicId: string) {
    this.logger.debug(`Resolving invoice publicId ${publicId}`);

    const invoice = await this.prisma.invoices.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        invoice_id: true,
      },
    });

    if (!invoice) {
      this.logger.warn(`Invoice with publicId ${publicId} not found.`);

      throw new NotFoundException({
        code: 'INVOICE_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'Invoice public ID does not exist.',
      });
    }

    this.logger.log(
      `Invoice publicId ${publicId} resolved: ${invoice.invoice_id}`,
    );

    return invoice.invoice_id;
  }

  async findOneInvoice(invoiceId: string) {
    this.logger.debug(`Finding invoice with UID ${invoiceId}.`);

    const invoice = await this.prisma.invoices.findFirst({
      where: {
        invoice_id: invoiceId,
      },
    });

    if (!invoice) {
      this.logger.warn(`Invoice ${invoiceId} not found.`);
      throw new NotFoundException({
        code: 'INVOICE_NOT_FOUND',
        message: 'Invoice not found',
      });
    }

    this.logger.log(`Invoice ${invoice.invoice_id} found.`);

    return invoice;
  }

  async findInvoiceForCampaign(campaignId: string) {
    this.logger.debug(`Finding invoice for campaign ${campaignId}`);

    const campaign = await this.campaignsService.findOneCampaign(campaignId);

    const invoice = await this.prisma.invoices.findFirst({
      where: {
        campaign_id: campaign.campaign_id,
      },
    });

    this.logger.log(
      `Successfully found invoice for campaign ${campaign.campaign_id}`,
    );

    return invoice;
  }

  assertCampaignCanBeInvoiced(campaign: Campaigns) {
    if (campaign.campaign_status != CampaignStatus.ACTIVE) {
      this.logger.warn(
        `Attempted to store invoice to non active campaign ${campaign.campaign_id}`,
      );

      throw new BadRequestException({
        code: 'CAMPAIGN_NOT_ACTIVE',
        message: `Cannot store invoice: campaign is ${campaign.campaign_status}, not ACTIVE.`,
      });
    }

    if (!campaign.all_deliverables_approved) {
      this.logger.warn(
        `Attempted to store invoice where all deliverables are not approved.`,
      );

      throw new BadRequestException({
        code: 'ALL_DELIVERABLES_NOT_APPROVED',
        message: `Cannot store invoice, all campaign deliverables are not approved.`,
      });
    }
  }
}
