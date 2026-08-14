import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WrittenAssetDraftsService } from './written-asset-drafts.service';
import { CreateWrittenAssetDraftDto } from './dto/create-written-asset-draft.dto';
import { plainToInstance } from 'class-transformer';
import { WrittenAssetDraftEntity } from './entities/written-asset-draft.entity';
import { UpdateWrittenAssetDraftDto } from './dto/update-written-asset-draft.dto';
import { DeliverableItemsService } from '../../deliverable/deliverable-items/deliverable-items.service';
import {
  ApiCreateWrittenAssetDraft,
  ApiDeleteWrittenAssetDraft,
  ApiFindWrittenAssetDraft,
  ApiFindWrittenAssetDraftsForAsset,
  ApiUpdateWrittenAssetDraft,
} from './docs/written-asset-drafts.controller.swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('written-asset-drafts')
export class WrittenAssetDraftsController {
  constructor(
    private readonly writtenAssetDraftsService: WrittenAssetDraftsService,
    private readonly deliverableItemsService: DeliverableItemsService,
  ) {}

  @ApiCreateWrittenAssetDraft()
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async create(@Body() dto: CreateWrittenAssetDraftDto) {
    const draft = await this.writtenAssetDraftsService.createDraft(dto);
    return plainToInstance(WrittenAssetDraftEntity, draft);
  }

  @ApiFindWrittenAssetDraft()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findOne(@Param('publicId') publicId: string) {
    const draftId =
      await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const draft = await this.writtenAssetDraftsService.findOneDraft(draftId);
    return plainToInstance(WrittenAssetDraftEntity, draft);
  }

  @ApiFindWrittenAssetDraftsForAsset()
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findMany(
    @Query('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    const drafts =
      await this.writtenAssetDraftsService.findDraftsForDeliverableItem(
        deliverableItemId,
      );
    return plainToInstance(WrittenAssetDraftEntity, drafts);
  }

  @ApiUpdateWrittenAssetDraft()
  @Patch(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateWrittenAssetDraftDto,
  ) {
    const draftId =
      await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const updatedDraft = await this.writtenAssetDraftsService.updateDraft(
      draftId,
      dto,
    );
    return plainToInstance(WrittenAssetDraftEntity, updatedDraft);
  }

  @ApiDeleteWrittenAssetDraft()
  @Delete(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async remove(@Param('publicId') publicId: string) {
    const draftId =
      await this.writtenAssetDraftsService.resolvePublicId(publicId);
    const deletedDraft =
      await this.writtenAssetDraftsService.deleteDraft(draftId);
    return plainToInstance(WrittenAssetDraftEntity, deletedDraft);
  }
}
