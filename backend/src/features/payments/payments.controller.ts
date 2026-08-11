import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Patch,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/shared/upload/upload.service';
import { plainToInstance } from 'class-transformer';
import { PaymentsEntity } from './entities/payments.entity';
import { CampaignStatus, PaymentSchedule } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly campaignsService: CampaignsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('pay')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Query('campaignPublic') campaignPublic: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(campaignPublic);

    const uploadResult = await this.uploadService.upload(file);
    const paymentRecord = await this.paymentsService.createPayment({
      campaignId: campaignId,
      proofPaymentUrl: uploadResult.url,
    });

    return plainToInstance(PaymentsEntity, paymentRecord);
  }

  @Get(':publicId')
  async findOnePaymentRecord(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const payment = await this.paymentsService.findOnePaymentRecord(paymentId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @Get('/campaign/:publicId')
  async findPaymentForCampaign(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const payment =
      await this.paymentsService.findPaymentForCampaign(campaignId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @Patch('/validate/:publicId')
  async validatePayment(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const paymentRecord =
      await this.paymentsService.findOnePaymentRecord(paymentId);

    const validatedPayment =
      await this.paymentsService.validatePayment(paymentId);

    const campaign = await this.campaignsService.findOneCampaign(
      paymentRecord.campaign_id,
    );

    const paidAmount =
      campaign.payment_schedule === PaymentSchedule.DUE_FINAL_DELIVERY
        ? campaign.pricing.toNumber()
        : campaign.paid_amount.mul(2).toNumber();

    await this.campaignsService.updateCampaignStatus(campaign.campaign_id, {
      campaignStatus: CampaignStatus.COMPLETED,
    });

    await this.campaignsService.updatePaidAmount(campaign.campaign_id, {
      paidAmount: paidAmount,
    });

    return plainToInstance(PaymentsEntity, validatedPayment);
  }
}
