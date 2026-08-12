import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreatePaymentDTO } from './dto/create-payment.dto';
import { CampaignStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
  ) {}

  async createPayment(dto: CreatePaymentDTO) {
    this.logger.debug(`Storing payment for campaign ${dto.campaignId}`);

    const campaign = await this.campaignsService.findOneCampaign(
      dto.campaignId,
    );

    if (campaign.campaign_status != CampaignStatus.ACTIVE) {
      this.logger.warn(
        `Attempted to record payment to non active campaign ${campaign.campaign_id}`,
      );

      throw new BadRequestException({
        code: 'CAMPAIGN_NOT_ACTIVE',
        message: `Cannot record payment: campaign is ${campaign.campaign_status}, not ACTIVE.`,
      });
    }

    const publicId = nanoid(10);
    const recordedPayment = await this.prisma.payments.create({
      data: {
        public_id: publicId,
        campaign_id: campaign.campaign_id,
        proof_payment_url: dto.proofPaymentUrl,
      },
    });

    this.logger.log(
      `Stored payment ${recordedPayment.payment_id} for ${campaign.campaign_id}.`,
    );

    return recordedPayment;
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

  async findOnePaymentRecord(paymentId: string) {
    this.logger.debug(`Finding payment with UID ${paymentId}.`);

    const payment = await this.prisma.payments.findFirst({
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

    const paymentRecord = await this.findOnePaymentRecord(paymentId);

    const validatedPayment = this.prisma.payments.update({
      where: { payment_id: paymentRecord.payment_id },
      data: {
        is_payment_verified: true,
      },
    });

    this.logger.log(`Successfully validated payment ${paymentId}.`);

    return validatedPayment;
  }
}
