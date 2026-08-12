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

@Controller('deliverable-submissions')
export class DeliverableSubmissionsController {
  constructor(
    private readonly deliverableSubmissionsService: DeliverableSubmissionsService,
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('written-assets')
  async submitWrittenAsset(@Body() dto: SubmitWrittenAssetDTO) {
    return this.deliverableSubmissionsService.submitWrittenAsset(dto);
  }

  @Post('media-assets')
  @UseInterceptors(FileInterceptor('file'))
  async submitMediaAsset(
    @Body('deliverableItemId') deliverableItemId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploadResult = await this.uploadService.upload(file);

    return this.deliverableSubmissionsService.submitMediaAsset({
      deliverableItemId,
      content_url: uploadResult.url,
      is_video: uploadResult.type === 'video',
    });
  }

  @Patch('written-assets/:publicId/approve')
  async approveWrittenAsset(@Param('publicId') publicId: string) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);
    return this.deliverableSubmissionsService.approveWrittenAsset(
      writtenAssetId,
    );
  }

  @Patch('written-assets/:publicId/revise')
  async reviseWrittenAsset(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateWrittenAssetCommentDTO,
  ) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);
    return this.deliverableSubmissionsService.reviseWrittenAsset(
      writtenAssetId,
      dto,
    );
  }

  @Patch('media-assets/:publicId/revise')
  async reviseMediaAsset(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateMediaAssetCommentDTO,
  ) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);
    return this.deliverableSubmissionsService.reviseMediaAsset(
      mediaAssetId,
      dto,
    );
  }

  @Patch('media-assets/:publicId/approve')
  async approveMediaAsset(@Param('publicId') publicId: string) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);
    return this.deliverableSubmissionsService.approveMediaAsset(mediaAssetId);
  }
}
