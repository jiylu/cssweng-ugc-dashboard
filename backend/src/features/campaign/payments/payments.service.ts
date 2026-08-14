import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import {
  Campaigns,
  CampaignStatus,
  Prisma,
  ProposalStatus,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { ProposalsService } from '../proposals/proposals.service';
import { InvoiceService } from '../invoices/invoice.service';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
    private proposalsService: ProposalsService,
    private invoiceService: InvoiceService,
  ) {}

  async sendInvoice(campaignId: string) {
    const campaign = await this.campaignsService.findOneCampaign(campaignId);

    if (campaign.campaign_status !== CampaignStatus.ACTIVE) {
      throw new BadRequestException({
        code: 'CAMPAIGN_NOT_ACTIVE',
        message: 'An invoice can only be sent for an active campaign.',
      });
    }
    if (!campaign.all_deliverables_approved) {
      throw new BadRequestException({
        code: 'ALL_DELIVERABLES_NOT_APPROVED',
        message: 'All campaign deliverables must be approved before invoicing.',
      });
    }

    const existingInvoice = await this.prisma.payments.findFirst({
      where: { campaign_id: campaignId, invoice_sent_at: { not: null } },
      orderBy: { created_at: 'desc' },
    });
    const invoice =
      existingInvoice ??
      (await this.prisma.payments.create({
        data: {
          public_id: nanoid(10),
          campaign_id: campaignId,
          invoice_sent_at: new Date(),
        },
      }));

    return {
      invoice,
      client_id: campaign.client_id,
      project_name: campaign.project_name,
    };
  }

  async createPayment(dto: CreatePaymentDTO) {
    this.logger.debug(`Storing payment for campaign ${dto.campaignId}`);

    const campaign = await this.campaignsService.findOneCampaign(
      dto.campaignId,
    );

    await this.assertCampaignCanBePaid(campaign);

    const invoice = await this.prisma.payments.findFirst({
      where: { campaign_id: campaign.campaign_id, invoice_sent_at: { not: null } },
      orderBy: { created_at: 'desc' },
    });
    if (!invoice) {
      throw new ConflictException({
        code: 'INVOICE_NOT_SENT',
        message: 'The creator must send an invoice before payment proof can be uploaded.',
      });
    }

    const recordedPayment = await this.prisma.payments.update({
      where: { payment_id: invoice.payment_id },
      data: { proof_payment_url: dto.proofPaymentUrl },
    });

    this.logger.log(
      `Stored payment ${recordedPayment.payment_id} for ${campaign.campaign_id}.`,
    );

    return {
      recordedPayment,
      creator_id: campaign.ugc_creator_id,
      project_name: campaign.project_name,
    };
  }

  async resolvePublicId(publicId: string) {
    this.logger.debug(`Resolving payment publicId ${publicId}`);

    const recordedPayment = await this.prisma.payments.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        payment_id: true,
      },
    });

    if (!recordedPayment) {
      this.logger.warn(`Payment with publicId ${publicId} not found.`);

      throw new NotFoundException({
        code: 'PAYMENT_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'Payment public ID does not exist.',
      });
    }

    this.logger.log(
      `Payment publicId ${publicId} resolved: ${recordedPayment.payment_id}`,
    );

    return recordedPayment.payment_id;
  }

  async findOnePaymentRecord(
    paymentId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding payment with UID ${paymentId}.`);

    const payment = await tx.payments.findFirst({
      where: {
        payment_id: paymentId,
      },
    });

    if (!payment) {
      this.logger.warn(`Payment ${paymentId} not found.`);
      throw new NotFoundException({
        code: 'PAYMENT_NOT_FOUND',
        message: 'Payment not found',
      });
    }

    this.logger.log(`Payment ${payment.payment_id} found.`);

    return payment;
  }

  async findPaymentForCampaign(campaignId: string) {
    this.logger.debug(`Finding latest payment for campaign ${campaignId}`);

    await this.campaignsService.findOneCampaign(campaignId);

    const latestPayment = await this.prisma.payments.findFirst({
      where: {
        campaign_id: campaignId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    this.logger.debug(
      `Successfully found latest payment for campaign ${campaignId}.`,
    );

    return latestPayment;
  }

  async validatePayment(paymentId: string) {
    this.logger.debug(`Validating payment ${paymentId}`);

    const result = await this.prisma.$transaction(async (tx) => {
      const paymentRecord = await this.findOnePaymentRecord(paymentId, tx);

      if (!paymentRecord.proof_payment_url) {
        throw new ConflictException({
          code: 'PAYMENT_PROOF_NOT_SUBMITTED',
          message: 'Payment proof must be submitted before validation.',
        });
      }

      const campaign = await this.campaignsService.findOneCampaign(
        paymentRecord.campaign_id,
        tx,
      );

      const proposal = await this.proposalsService.findProposalByCampaignId(
        campaign.campaign_id,
        false,
        tx,
      );

      if (proposal.proposal_status !== ProposalStatus.ACCEPTED) {
        this.logger.log(
          `Cannot validate payment for proposal that is not accepted.`,
        );

        throw new ConflictException({
          code: 'CAMPAIGN_PROPOSAL_NOT_ACCEPTED',
          message:
            'Campaign proposal must be accepted before validating payment',
        });
      }

      const validatedPayment = await tx.payments.update({
        where: { payment_id: paymentRecord.payment_id },
        data: {
          is_payment_verified: true,
          verified_at: new Date(),
        },
      });

      const paidAmount = Math.max(
        campaign.paid_amount.toNumber(),
        campaign.pricing.toNumber(),
      );

      await this.campaignsService.updateCampaignStatus(
        campaign.campaign_id,
        {
          campaignStatus: CampaignStatus.COMPLETED,
        },
        tx,
      );

      await this.campaignsService.updatePaidAmount(
        campaign.campaign_id,
        {
          paidAmount: paidAmount,
        },
        tx,
      );

      await this.campaignsService.updatePaidFull(campaign.campaign_id, tx);

      return {
        validatedPayment,
        client_id: campaign.client_id,
        project_name: campaign.project_name,
      };
    });

    this.logger.log(`Successfully validated payment ${paymentId}.`);

    return result;
  }

  async assertCampaignCanBePaid(campaign: Campaigns) {
    if (campaign.campaign_status != CampaignStatus.ACTIVE) {
      this.logger.warn(
        `Attempted to record payment to non active campaign ${campaign.campaign_id}`,
      );

      throw new BadRequestException({
        code: 'CAMPAIGN_NOT_ACTIVE',
        message: `Cannot record payment: campaign is ${campaign.campaign_status}, not ACTIVE.`,
      });
    }

    if (!campaign.all_deliverables_approved) {
      this.logger.warn(
        `Attempted to pay campaign where all deliverables are not approved.`,
      );

      throw new BadRequestException({
        code: 'ALL_DELIVERABLES_NOT_APPROVED',
        message: `Cannot record payment, all campaign deliverables are not approved.`,
      });
    }

    const invoice = await this.invoiceService.findInvoiceForCampaign(
      campaign.campaign_id,
    );

    if (!invoice) {
      throw new BadRequestException({
        code: 'NO_INVOICE_FOUND',
        message: `Cannot record payment. No invoice yet for campaign.`,
      });
    }
  }
}
