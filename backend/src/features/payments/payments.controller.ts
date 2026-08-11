import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Patch,
  ConflictException,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/shared/upload/upload.service';
import { plainToInstance } from 'class-transformer';
import { PaymentsEntity } from './entities/payments.entity';
import {
  CampaignStatus,
  PaymentSchedule,
  ProposalStatus,
} from '@prisma/client';
import { ProposalsService } from '../proposals/proposals.service';
import {
  ApiCreatePayment,
  ApiFindPaymentByPublicId,
  ApiFindPaymentForCampaign,
  ApiValidatePayment,
} from './docs/payments.controller.swagger';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly campaignsService: CampaignsService,
    private readonly uploadService: UploadService,
    private readonly proposalsService: ProposalsService,
  ) {}

  @ApiCreatePayment()
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

  @ApiFindPaymentByPublicId()
  @Get(':publicId')
  async findOnePaymentRecord(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const payment = await this.paymentsService.findOnePaymentRecord(paymentId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @ApiFindPaymentForCampaign()
  @Get('/campaign/:publicId')
  async findPaymentForCampaign(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const payment =
      await this.paymentsService.findPaymentForCampaign(campaignId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @ApiValidatePayment()
  @Patch('/validate/:publicId')
  async validatePayment(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const paymentRecord =
      await this.paymentsService.findOnePaymentRecord(paymentId);

    const campaign = await this.campaignsService.findOneCampaign(
      paymentRecord.campaign_id,
    );

    const proposal = await this.proposalsService.findProposalByCampaignId(
      paymentRecord.campaign_id,
    );

    if (proposal.proposal_status !== ProposalStatus.ACCEPTED) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_PROPOSAL_NOT_ACCEPTED',
        message: 'Campaign proposal must be accepted before validating payment',
      });
    }

    const validatedPayment =
      await this.paymentsService.validatePayment(paymentId);

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
