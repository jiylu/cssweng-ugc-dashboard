import {
  Controller,
  Post,
  Get,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/shared/upload/upload.service';
import { plainToInstance } from 'class-transformer';
import { PaymentsEntity } from './entities/payments.entity';
import {
  ApiCreatePayment,
  ApiFindPaymentByPublicId,
  ApiFindPaymentForCampaign,
  ApiValidatePayment,
} from './docs/payments.controller.swagger';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('payments')
export class PaymentsController {
  constructor(
    private readonly paymentsService: PaymentsService,
    private readonly campaignsService: CampaignsService,
    private readonly uploadService: UploadService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post('invoice')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async sendInvoice(@Query('campaignPublic') campaignPublic: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(campaignPublic);
    const result = await this.paymentsService.sendInvoice(campaignId);

    if (result.client_id) {
      await this.notificationsService.createNotification({
        category: 'PAYMENT',
        userId: result.client_id,
        title: 'An invoice has been sent',
        message: `The creator has sent an invoice for "${result.project_name}". You can now upload proof of payment.`,
      });
    }

    return plainToInstance(PaymentsEntity, result.invoice);
  }

  @ApiCreatePayment()
  @Post('pay')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Query('campaignPublic') campaignPublic: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(campaignPublic);

    const uploadResult = await this.uploadService.upload(file);
    const result = await this.paymentsService.createPayment({
      campaignId: campaignId,
      proofPaymentUrl: uploadResult.url,
    });

    await this.notificationsService.createNotification({
      category: 'PAYMENT',
      userId: result.creator_id,
      title: 'Payment proof has been submitted',
      message: `The client has submitted proof of payment for "${result.project_name}". Please review and validate the payment.`,
    });

    return plainToInstance(PaymentsEntity, result.recordedPayment);
  }

  @ApiFindPaymentByPublicId()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  async findOnePaymentRecord(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const payment = await this.paymentsService.findOnePaymentRecord(paymentId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @ApiFindPaymentForCampaign()
  @Get('/campaign/:publicId')
  @UseGuards(RolesGuard)
  async findPaymentForCampaign(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const payment =
      await this.paymentsService.findPaymentForCampaign(campaignId);

    return plainToInstance(PaymentsEntity, payment);
  }

  @ApiValidatePayment()
  @Patch('/validate/:publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async validatePayment(@Param('publicId') publicId: string) {
    const paymentId = await this.paymentsService.resolvePublicId(publicId);
    const result = await this.paymentsService.validatePayment(paymentId);

    if (result.client_id) {
      await this.notificationsService.createNotification({
        category: 'PAYMENT',
        userId: result.client_id,
        title: 'Payment has been validated',
        message: `Your payment for "${result.project_name}" has been validated.`,
      });
    }

    return plainToInstance(PaymentsEntity, result.validatedPayment);
  }
}
