import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateWrittenAssetDraftDto } from './dto/create-written-asset-draft.dto';
import { UpdateWrittenAssetDraftDto } from './dto/update-written-asset-draft.dto';
import { nanoid } from 'nanoid';
import { WrittenAssetsService } from '../written-assets/written-assets.service';

@Injectable()
export class WrittenAssetDraftsService {
  private readonly logger = new Logger(WrittenAssetDraftsService.name);
  constructor(
    private prisma: PrismaService,
    private writtenAssetsService: WrittenAssetsService,
  ) {}

  async createDraft(dto: CreateWrittenAssetDraftDto) {
    this.logger.debug(`Creating written asset draft for asset ${dto.writtenAssetPublicId}`);

    const writtenAssetId = await this.writtenAssetsService.resolvePublicId(dto.writtenAssetPublicId);
    const publicId = nanoid(10);

    const draft = await this.prisma.writtenAssetsDrafts.create({
      data: {
        public_id: publicId,
        written_asset_id: writtenAssetId,
        content: dto.content,
        created_at: new Date(),
      },
    });

    this.logger.log(`Created written asset draft with publicId ${publicId}`);

    return draft;
  }

  async resolvePublicId(publicId: string) {
    this.logger.log(`Resolving publicId ${publicId}`);

    const draft = await this.prisma.writtenAssetsDrafts.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        written_asset_draft_id: true,
      },
    });

    if (!draft) {
      this.logger.warn(`Written asset draft with publicId ${publicId} not found.`);
      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }
    this.logger.log(`Public id ${publicId} resolved: ${draft.written_asset_draft_id}`);
    return draft.written_asset_draft_id;
  }

  async findOneDraft(draftId: string) {
    this.logger.debug(`Finding written asset draft with UID ${draftId}`);

    const draft = await this.prisma.writtenAssetsDrafts.findFirst({
      where: {
        written_asset_draft_id: draftId,
      },
    });

    if (!draft) {
      this.logger.warn(`Written asset draft ${draftId} not found.`);
      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }

    this.logger.log(`Written asset draft ${draftId} found.`);

    return draft;
  }

  async findDraftsForWrittenAsset(writtenAssetId: string) {
    this.logger.debug(`Finding drafts for written asset ${writtenAssetId}`);

    const drafts = await this.prisma.writtenAssetsDrafts.findMany({
      where: {
        written_asset_id: writtenAssetId,
      },
    });

    this.logger.log(`Found ${drafts.length} drafts for written asset ${writtenAssetId}.`);
    return drafts;
  }

  async updateDraft(draftId: string, dto: UpdateWrittenAssetDraftDto) {
    this.logger.debug(`Updating written asset draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const updatedDraft = await this.prisma.writtenAssetsDrafts.update({
      where: {
        written_asset_draft_id: draft.written_asset_draft_id,
      },
      data: {
        ...(dto.content !== undefined && { content: dto.content }),
        updated_at: new Date(),
      },
    });

    this.logger.log(`Updated written asset draft with UID ${draftId}`);

    return updatedDraft;
  }

  async deleteDraft(draftId: string) {
    this.logger.debug(`Deleting written asset draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const deletedDraft = await this.prisma.writtenAssetsDrafts.delete({
      where: {
        written_asset_draft_id: draft.written_asset_draft_id,
      },
    });

    this.logger.log(`Deleted written asset draft with UID ${draftId}`);

    return deletedDraft;
  }
}
