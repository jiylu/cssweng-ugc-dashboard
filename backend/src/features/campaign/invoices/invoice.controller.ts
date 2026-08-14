import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { UploadService } from 'src/shared/upload/upload.service';
import { NotificationsService } from 'src/shared/notifications/notifications.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { InvoiceEntity } from './entities/invoice.entity';
import {
  ApiCreateInvoice,
  ApiFindInvoiceByPublicId,
  ApiFindInvoiceForCampaign,
} from './docs/invoices.controller.swagger';

@Controller('invoices')
export class InvoiceController {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly uploadService: UploadService,
    private readonly notificationService: NotificationsService,
    private readonly campaignService: CampaignsService,
  ) {}

  @ApiCreateInvoice()
  @Post('store')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Query('campaignPublic') campaignPublic: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const campaignId =
      await this.campaignService.resolveCampaignPublicId(campaignPublic);

    const uploadResult = await this.uploadService.upload(file);
    const result = await this.invoiceService.createInvoice({
      campaignId: campaignId,
      invoiceUrl: uploadResult.url,
    });

    if (result.client_id) {
      await this.notificationService.createNotification({
        userId: result.client_id,
        title: 'Invoice Has Been Submitted',
        message: `The creator for campaign ${result.project_name} has submitted the invoice for the campaign.`,
      });
    }

    return plainToInstance(InvoiceEntity, result.invoice);
  }

  @ApiFindInvoiceByPublicId()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  async findOneInvoice(@Param('publicId') publicId: string) {
    const invoiceId = await this.invoiceService.resolvePublicId(publicId);
    const invoice = await this.invoiceService.findOneInvoice(invoiceId);

    return plainToInstance(InvoiceEntity, invoice);
  }

  @ApiFindInvoiceForCampaign()
  @Get('/campaign/:publicId')
  @UseGuards(RolesGuard)
  async findInvoiceForCampaign(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignService.resolveCampaignPublicId(publicId);
    const invoice =
      await this.invoiceService.findInvoiceForCampaign(campaignId);

    return plainToInstance(InvoiceEntity, invoice);
  }
}
