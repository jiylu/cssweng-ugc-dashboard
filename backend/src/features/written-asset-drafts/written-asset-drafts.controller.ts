import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { WrittenAssetDraftsService } from './written-asset-drafts.service';
import { CreateWrittenAssetDraftDto } from './dto/create-written-asset-draft.dto';
import { plainToInstance } from 'class-transformer';
import { WrittenAssetDraftEntity } from './entities/written-asset-draft.entity';
import { UpdateWrittenAssetDraftDto } from './dto/update-written-asset-draft.dto';
import { WrittenAssetsService } from '../written-assets/written-assets.service';
import {
  ApiCreateWrittenAssetDraft,
  ApiDeleteWrittenAssetDraft,
  ApiFindWrittenAssetDraft,
  ApiFindWrittenAssetDraftsForAsset,
  ApiUpdateWrittenAssetDraft,
} from './docs/written-asset-drafts.controller.swagger';

@Controller('written-asset-drafts')
export class WrittenAssetDraftsController {
  constructor(
    private readonly writtenAssetDraftsService: WrittenAssetDraftsService,
    private readonly writtenAssetsService: WrittenAssetsService,
  ) {}

  @ApiCreateWrittenAssetDraft()
  @Post()
  async create(@Body() dto: CreateWrittenAssetDraftDto) {
    const draft = await this.writtenAssetDraftsService.createDraft(dto);
    return plainToInstance(WrittenAssetDraftEntity, draft);
  }

  @ApiFindWrittenAssetDraft()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const draftId = await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const draft = await this.writtenAssetDraftsService.findOneDraft(draftId);
    return plainToInstance(WrittenAssetDraftEntity, draft);
  }

  @ApiFindWrittenAssetDraftsForAsset()
  @Get()
  async findMany(@Query('writtenAssetPublicId') writtenAssetPublicId: string) {
    const writtenAssetId = await this.writtenAssetsService.resolvePublicId(writtenAssetPublicId);
    const drafts = await this.writtenAssetDraftsService.findDraftsForWrittenAsset(writtenAssetId);
    return plainToInstance(WrittenAssetDraftEntity, drafts);
  }

  @ApiUpdateWrittenAssetDraft()
  @Patch(':publicId')
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateWrittenAssetDraftDto,
  ) {
    const draftId = await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const updatedDraft = await this.writtenAssetDraftsService.updateDraft(draftId, dto);
    return plainToInstance(WrittenAssetDraftEntity, updatedDraft);
  }

  @ApiDeleteWrittenAssetDraft()
  @Delete(':publicId')
  async remove(@Param('publicId') publicId: string) {
    const draftId = await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const deletedDraft = await this.writtenAssetDraftsService.deleteDraft(draftId);
    return plainToInstance(WrittenAssetDraftEntity, deletedDraft);
  }
}
