import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MediaAssetDraftsService } from './media-asset-drafts.service';
import { plainToInstance } from 'class-transformer';
import { MediaAssetDraftEntity } from './entities/media-asset-draft.entity';
import { MediaAssetsService } from '../media-assets/media-assets.service';
import { UploadService } from 'src/shared/upload/upload.service';
import {
  ApiCreateMediaAssetDraft,
  ApiDeleteMediaAssetDraft,
  ApiFindMediaAssetDraft,
  ApiFindMediaAssetDraftsForAsset,
  ApiUpdateMediaAssetDraft,
} from './docs/media-asset-drafts.controller.swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('media-asset-drafts')
export class MediaAssetDraftsController {
  constructor(
    private readonly mediaAssetDraftsService: MediaAssetDraftsService,
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly uploadService: UploadService,
  ) {}

  @ApiCreateMediaAssetDraft()
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body('mediaAssetPublicId') mediaAssetPublicId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const uploadResult = await this.uploadService.upload(file);
    const draft = await this.mediaAssetDraftsService.createDraft(
      mediaAssetPublicId,
      uploadResult.url,
    );
    return plainToInstance(MediaAssetDraftEntity, draft);
  }

  @ApiFindMediaAssetDraft()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findOne(@Param('publicId') publicId: string) {
    const draftId =
      await this.mediaAssetDraftsService.resolvePublicId(publicId);
    const draft = await this.mediaAssetDraftsService.findOneDraft(draftId);
    return plainToInstance(MediaAssetDraftEntity, draft);
  }

  @ApiFindMediaAssetDraftsForAsset()
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findMany(@Query('mediaAssetPublicId') mediaAssetPublicId: string) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(mediaAssetPublicId);
    const drafts =
      await this.mediaAssetDraftsService.findDraftsForMediaAsset(mediaAssetId);
    return plainToInstance(MediaAssetDraftEntity, drafts);
  }

  @ApiUpdateMediaAssetDraft()
  @Patch(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('publicId') publicId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    const draftId =
      await this.mediaAssetDraftsService.resolvePublicId(publicId);
    const uploadResult = await this.uploadService.upload(file);
    const updatedDraft = await this.mediaAssetDraftsService.updateDraft(
      draftId,
      uploadResult.url,
    );
    return plainToInstance(MediaAssetDraftEntity, updatedDraft);
  }

  @ApiDeleteMediaAssetDraft()
  @Delete(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async remove(@Param('publicId') publicId: string) {
    const draftId =
      await this.mediaAssetDraftsService.resolvePublicId(publicId);
    const deletedDraft =
      await this.mediaAssetDraftsService.deleteDraft(draftId);
    return plainToInstance(MediaAssetDraftEntity, deletedDraft);
  }
}
