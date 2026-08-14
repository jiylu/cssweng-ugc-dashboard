import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { nanoid } from 'nanoid';
import { MediaAssetsService } from '../media-assets/media-assets.service';

@Injectable()
export class MediaAssetDraftsService {
  private readonly logger = new Logger(MediaAssetDraftsService.name);
  constructor(
    private prisma: PrismaService,
    private mediaAssetsService: MediaAssetsService,
  ) {}

  async createDraft(mediaAssetPublicId: string, contentUrl: string) {
    this.logger.debug(
      `Creating media asset draft for asset ${mediaAssetPublicId}`,
    );

    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(mediaAssetPublicId);
    const publicId = nanoid(10);

    const draft = await this.prisma.mediaAssetsDrafts.create({
      data: {
        public_id: publicId,
        media_asset_id: mediaAssetId,
        content_url: contentUrl,
        created_at: new Date(),
      },
    });

    this.logger.log(`Created media asset draft with publicId ${publicId}`);

    return draft;
  }

  async resolvePublicId(publicId: string) {
    this.logger.log(`Resolving publicId ${publicId}`);

    const draft = await this.prisma.mediaAssetsDrafts.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        media_asset_draft_id: true,
      },
    });

    if (!draft) {
      this.logger.warn(
        `Media asset draft with publicId ${publicId} not found.`,
      );
      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }
    this.logger.log(
      `Public id ${publicId} resolved: ${draft.media_asset_draft_id}`,
    );
    return draft.media_asset_draft_id;
  }

  async findOneDraft(draftId: string) {
    this.logger.debug(`Finding media asset draft with UID ${draftId}`);

    const draft = await this.prisma.mediaAssetsDrafts.findFirst({
      where: {
        media_asset_draft_id: draftId,
      },
    });

    if (!draft) {
      this.logger.warn(`Media asset draft ${draftId} not found.`);
      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }

    this.logger.log(`Media asset draft ${draftId} found.`);

    return draft;
  }

  async findDraftsForMediaAsset(mediaAssetId: string) {
    this.logger.debug(`Finding drafts for media asset ${mediaAssetId}`);

    const drafts = await this.prisma.mediaAssetsDrafts.findMany({
      where: {
        media_asset_id: mediaAssetId,
      },
    });

    this.logger.log(
      `Found ${drafts.length} drafts for media asset ${mediaAssetId}.`,
    );
    return drafts;
  }

  async updateDraft(draftId: string, contentUrl: string) {
    this.logger.debug(`Updating media asset draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const updatedDraft = await this.prisma.mediaAssetsDrafts.update({
      where: {
        media_asset_draft_id: draft.media_asset_draft_id,
      },
      data: {
        content_url: contentUrl,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Updated media asset draft with UID ${draftId}`);

    return updatedDraft;
  }

  async deleteDraft(draftId: string) {
    this.logger.debug(`Deleting media asset draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const deletedDraft = await this.prisma.mediaAssetsDrafts.delete({
      where: {
        media_asset_draft_id: draft.media_asset_draft_id,
      },
    });

    this.logger.log(`Deleted media asset draft with UID ${draftId}`);

    return deletedDraft;
  }
}
