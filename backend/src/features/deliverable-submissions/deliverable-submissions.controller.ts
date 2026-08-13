import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';
import { WrittenAssetsService } from '../written-assets/written-assets.service';
import { MediaAssetsService } from '../media-assets/media-assets.service';
import { UploadService } from 'src/shared/upload/upload.service';
import { SubmitWrittenAssetDTO } from '../written-assets/dto/submit-written-asset.dto';
import { UpdateWrittenAssetCommentDTO } from '../written-assets/dto/update-written-asset-comment.dto';
import { UpdateMediaAssetCommentDTO } from '../media-assets/dto/update-media-asset-comment.dto';
import {
  ApiApproveMediaAsset,
  ApiApproveWrittenAsset,
  ApiReviseMediaAsset,
  ApiReviseWrittenAsset,
  ApiSubmitMediaAsset,
  ApiSubmitWrittenAsset,
} from './docs/deliverable-submissions.controller.swagger';
import { DeliverableItemsService } from '../deliverable-items/deliverable-items.service';
import { NotificationsService } from '../notifications/notifications.service';

@Controller('deliverable-submissions')
export class DeliverableSubmissionsController {
  constructor(
    private readonly deliverableSubmissionsService: DeliverableSubmissionsService,
    private readonly deliverableItemsService: DeliverableItemsService,
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly uploadService: UploadService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @ApiSubmitWrittenAsset()
  @Post('written-assets')
  async submitWrittenAsset(@Body() dto: SubmitWrittenAssetDTO) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        dto.deliverableItemPublicId,
      );

    const serviceResponse =
      await this.deliverableSubmissionsService.submitWrittenAsset(
        deliverableItemId,
        dto.content,
      );

    if (serviceResponse.client_id) {
      await this.notificationsService.createNotification({
        userId: serviceResponse.client_id,
        title: 'Creator has Submitted a Written Asset',
        message: `A written asset (v${serviceResponse.submittedWrittenAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" has been submitted. Please review the asset.`,
      });
    }

    return serviceResponse.submittedWrittenAsset;
  }

  @ApiSubmitMediaAsset()
  @Post('media-assets')
  @UseInterceptors(FileInterceptor('file'))
  async submitMediaAsset(
    @Body('deliverableItemPublicId') deliverableItemPublicId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadResult = await this.uploadService.upload(file);

    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );

    const serviceResponse =
      await this.deliverableSubmissionsService.submitMediaAsset({
        deliverableItemId,
        content_url: uploadResult.url,
        is_video: uploadResult.type === 'video',
      });

    if (serviceResponse.client_id) {
      await this.notificationsService.createNotification({
        userId: serviceResponse.client_id,
        title: 'Creator has Submitted a Media Asset',
        message: `A media asset (v${serviceResponse.submittedMediaAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" has been submitted. Please review the asset.`,
      });
    }

    return serviceResponse.submittedMediaAsset;
  }

  @ApiApproveWrittenAsset()
  @Patch('written-assets/:publicId/approve')
  async approveWrittenAsset(@Param('publicId') publicId: string) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);

    const serviceResponse =
      await this.deliverableSubmissionsService.approveWrittenAsset(
        writtenAssetId,
      );

    await this.notificationsService.createNotification({
      userId: serviceResponse.ugc_id,
      title: 'Client has Approved a Written Asset',
      message: `Your written asset (v${serviceResponse.updatedWrittenAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" has been approved. You can now submit the media asset.`,
    });

    return serviceResponse.updatedWrittenAsset;
  }

  @ApiReviseWrittenAsset()
  @Patch('written-assets/:publicId/revise')
  async reviseWrittenAsset(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateWrittenAssetCommentDTO,
  ) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);

    const serviceResponse =
      await this.deliverableSubmissionsService.reviseWrittenAsset(
        writtenAssetId,
        dto,
      );

    await this.notificationsService.createNotification({
      userId: serviceResponse.ugc_id,
      title: 'Client has Requested a Revision for a Written Asset',
      message: `Your written asset (v${serviceResponse.revisedWrittenAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" needs revision. Please review the client's feedback and resubmit.`,
    });

    return serviceResponse.revisedWrittenAsset;
  }

  @ApiReviseMediaAsset()
  @Patch('media-assets/:publicId/revise')
  async reviseMediaAsset(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateMediaAssetCommentDTO,
  ) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);

    const serviceResponse =
      await this.deliverableSubmissionsService.reviseMediaAsset(
        mediaAssetId,
        dto,
      );

    await this.notificationsService.createNotification({
      userId: serviceResponse.ugc_id,
      title: 'Client has Requested a Revision for a Media Asset',
      message: `Your media asset (v${serviceResponse.revisedMediaAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" needs revision. Please review the client's feedback and resubmit.`,
    });

    return serviceResponse.revisedMediaAsset;
  }

  @ApiApproveMediaAsset()
  @Patch('media-assets/:publicId/approve')
  async approveMediaAsset(@Param('publicId') publicId: string) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);

    const serviceResponse =
      await this.deliverableSubmissionsService.approveMediaAsset(mediaAssetId);

    await this.notificationsService.createNotification({
      userId: serviceResponse.ugc_id,
      title: 'Client has Approved a Media Asset',
      message: `Your media asset (v${serviceResponse.updatedMediaAsset.version_number}) for deliverable item #${serviceResponse.deliverable_index} of "${serviceResponse.deliverable_content}" has been approved.`,
    });

    return serviceResponse.updatedMediaAsset;
  }
}
