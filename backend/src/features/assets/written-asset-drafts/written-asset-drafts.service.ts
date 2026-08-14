import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateWrittenAssetDraftDto } from './dto/create-written-asset-draft.dto';
import { UpdateWrittenAssetDraftDto } from './dto/update-written-asset-draft.dto';
import { nanoid } from 'nanoid';
import { DeliverableItemsService } from '../../deliverable/deliverable-items/deliverable-items.service';

@Injectable()
export class WrittenAssetDraftsService {
  private readonly logger = new Logger(WrittenAssetDraftsService.name);
  constructor(
    private prisma: PrismaService,
    private deliverableItemsService: DeliverableItemsService,
  ) {}

  async createDraft(dto: CreateWrittenAssetDraftDto) {
    this.logger.debug(
      `Creating written asset draft for deliverable item ${dto.deliverableItemPublicId}`,
    );

    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        dto.deliverableItemPublicId,
      );

    const existing = await this.prisma.writtenAssetsDrafts.findFirst({
      where: {
        deliverable_item_id: deliverableItemId,
      },
      orderBy: { updated_at: 'desc' },
    });

    if (existing) {
      const updatedDraft = await this.prisma.writtenAssetsDrafts.update({
        where: {
          written_asset_draft_id: existing.written_asset_draft_id,
        },
        data: {
          content: dto.content,
          updated_at: new Date(),
        },
      });

      this.logger.log(
        `Updated written asset draft ${existing.written_asset_draft_id} for deliverable item ${deliverableItemId}`,
      );

      return updatedDraft;
    }

    const publicId = nanoid(10);

    const draft = await this.prisma.writtenAssetsDrafts.create({
      data: {
        public_id: publicId,
        deliverable_item_id: deliverableItemId,
        content: dto.content,
        created_at: new Date(),
      },
    });

    this.logger.log(
      `Created written asset draft with publicId ${publicId} for deliverable item ${deliverableItemId}`,
    );

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
      this.logger.warn(
        `Written asset draft with publicId ${publicId} not found.`,
      );
      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }
    this.logger.log(
      `Public id ${publicId} resolved: ${draft.written_asset_draft_id}`,
    );
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

  async findDraftsForDeliverableItem(deliverableItemId: string) {
    this.logger.debug(
      `Finding drafts for deliverable item ${deliverableItemId}`,
    );

    const drafts = await this.prisma.writtenAssetsDrafts.findMany({
      where: {
        deliverable_item_id: deliverableItemId,
      },
      orderBy: { updated_at: 'desc' },
    });

    this.logger.log(
      `Found ${drafts.length} drafts for deliverable item ${deliverableItemId}.`,
    );
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
