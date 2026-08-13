import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalsService } from '../proposals/proposals.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { DeliverableItemsService } from '../deliverable-items/deliverable-items.service';
import {
  AssetActions,
  Campaigns,
  DeliverableItems,
  Deliverables,
  MediaAssets,
  Prisma,
  Proposals,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { SubmitMediaAssetDTO } from './dto/submit-media-asset.dto';
import { UpdateMediaAssetActionDTO } from './dto/update-media-asset-action.dto';
import { UpdateMediaAssetCommentDTO } from './dto/update-media-asset-comment.dto';

@Injectable()
export class MediaAssetsService {
  private readonly logger = new Logger(MediaAssetsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
    private proposalsService: ProposalsService,
    private deliverablesService: DeliverablesService,
    private deliverableItemsService: DeliverableItemsService,
  ) {}

  async submitMediaAsset(dto: SubmitMediaAssetDTO) {
    this.logger.debug(`Submitting MediaAsset for ${dto.deliverableItemId}`);

    const result = this.prisma.$transaction(async (tx) => {
      const deliverableItem =
        await this.deliverableItemsService.findOneDeliverableItem(
          dto.deliverableItemId,
          tx,
        );

      this.assertWrittenAssetsApproved(deliverableItem);
      await this.assertNoPendingMediaAsset(deliverableItem.deliverable_item_id);

      const existingCount = await tx.mediaAssets.count({
        where: { deliverable_item_id: deliverableItem.deliverable_item_id },
      });

      const versionNumber = existingCount + 1;
      const publicId = nanoid(10);

      const mediaAsset = await tx.mediaAssets.create({
        data: {
          deliverable_item_id: deliverableItem.deliverable_item_id,
          public_id: publicId,
          version_number: versionNumber,
          is_video: dto.is_video,
          content_url: dto.content_url,
        },
      });

      this.logger.log(
        `Created MediaAsset ${mediaAsset.media_asset_id} (v${versionNumber}) for DeliverableItem ${mediaAsset.deliverable_item_id}`,
      );

      return mediaAsset;
    });

    return result;
  }

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Resolving media asset publicID ${publicId}`);

    const mediaAsset = await tx.mediaAssets.findFirst({
      where: { public_id: publicId },
      select: { media_asset_id: true },
    });

    if (!mediaAsset) {
      this.logger.warn(`MediaAsset with publicId ${publicId} not found.`);

      throw new NotFoundException({
        code: 'MEDIA_ASSET_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'MediaAsset not found.',
      });
    }

    this.logger.log(
      `MediaAsset publicID ${publicId} resolved: ${mediaAsset.media_asset_id}`,
    );

    return mediaAsset.media_asset_id;
  }

  async findOneMediaAsset(
    mediaAssetId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding media asset ${mediaAssetId}`);

    const mediaAsset = await tx.mediaAssets.findUnique({
      where: { media_asset_id: mediaAssetId },
    });

    if (!mediaAsset) {
      this.logger.warn(`MediaAsset with id ${mediaAssetId} not found.`);

      throw new NotFoundException({
        code: 'MEDIA_ASSET_NOT_FOUND',
        message: 'MediaAsset not found.',
      });
    }

    this.logger.log(`MediaAsset ${mediaAssetId} found.`);

    return mediaAsset;
  }

  async getMediaAssetHistoryForDeliverableItem(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding media asset history for DeliverableItem ${deliverableItemId}`,
    );

    const mediaAssets = await tx.mediaAssets.findMany({
      where: { deliverable_item_id: deliverableItemId },
      orderBy: { version_number: 'asc' },
    });

    this.logger.log(
      `Found ${mediaAssets.length} media asset versions for DeliverableItem ${deliverableItemId}.`,
    );

    return mediaAssets;
  }

  async getLatestAssetHistoryForDeliverableItem(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding latest media asset version for DeliverableItem ${deliverableItemId}`,
    );

    const latestMediaAsset = await this.findLatestMediaAsset(
      deliverableItemId,
      tx,
    );

    if (!latestMediaAsset) {
      this.logger.warn(
        `No media asset found for DeliverableItem ${deliverableItemId}.`,
      );

      throw new NotFoundException({
        code: 'MEDIA_ASSET_NOT_FOUND',
        message: 'No media asset found for this deliverable item.',
      });
    }

    this.logger.log(
      `Latest media asset (v${latestMediaAsset.version_number}) found for DeliverableItem ${deliverableItemId}.`,
    );

    return latestMediaAsset;
  }

  async updateMediaAssetAction(
    mediaAssetId: string,
    dto: UpdateMediaAssetActionDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating action for media asset ${mediaAssetId}`);

    const mediaAsset = await this.findOneMediaAsset(mediaAssetId, tx);

    if (mediaAsset.media_asset_action !== AssetActions.PENDING) {
      this.logger.warn(
        `Cannot update action for MediaAsset ${mediaAssetId} since it is already ${mediaAsset.media_asset_action}.`,
      );

      throw new ConflictException({
        code: 'MEDIA_ASSET_ACTION_CANNOT_BE_UPDATED',
        message:
          'Media asset action can only be updated while the action is PENDING.',
      });
    }

    const updated = await tx.mediaAssets.update({
      where: { media_asset_id: mediaAssetId },
      data: {
        media_asset_action: dto.action,
        updated_at: new Date(),
      },
    });

    this.logger.log(
      `Action updated to ${updated.media_asset_action} for media asset ${mediaAssetId}`,
    );

    return updated;
  }

  async updateMediaAssetComments(
    mediaAssetId: string,
    dto: UpdateMediaAssetCommentDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Updating client comments for media asset ${mediaAssetId}`,
    );

    await this.findOneMediaAsset(mediaAssetId, tx);

    const updated = await tx.mediaAssets.update({
      where: { media_asset_id: mediaAssetId },
      data: {
        client_comments: dto.comment,
        updated_at: new Date(),
      },
    });

    this.logger.log(`Client comments updated for media asset ${mediaAssetId}`);

    return updated;
  }

  // utils
  async extractDeliverableCampaignProposal(
    deliverableID: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ): Promise<[Deliverables, Campaigns, Proposals]> {
    const deliverable = await this.deliverablesService.findOneDeliverableByUID(
      deliverableID,
      tx,
    );

    const campaign = await this.campaignsService.findOneCampaign(
      deliverable.campaign_id,
      tx,
    );

    const proposal = await this.proposalsService.findProposalByCampaignId(
      campaign.campaign_id,
      false,
      tx,
    );

    return [deliverable, campaign, proposal];
  }

  assertWrittenAssetsApproved(deliverableItem: DeliverableItems) {
    if (!deliverableItem.written_asset_approved) {
      this.logger.warn(
        `Cannot submit media asset for DeliverableItem ${deliverableItem.deliverable_item_id} since written asset is not approved.`,
      );

      throw new ConflictException({
        code: 'WRITTEN_ASSET_NOT_APPROVED',
        message:
          'Cannot submit media asset when the written asset is not approved.',
      });
    }
  }

  async findLatestMediaAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ): Promise<MediaAssets | null> {
    return tx.mediaAssets.findFirst({
      where: { deliverable_item_id: deliverableItemId },
      orderBy: { version_number: 'desc' },
    });
  }

  async assertNoPendingMediaAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const latestMediaAsset = await this.findLatestMediaAsset(
      deliverableItemId,
      tx,
    );

    if (
      latestMediaAsset &&
      latestMediaAsset.media_asset_action === AssetActions.PENDING
    ) {
      this.logger.warn(
        `Cannot submit media asset for DeliverableItem ${deliverableItemId} since a previous version is still awaiting review.`,
      );

      throw new ConflictException({
        code: 'PENDING_MEDIA_ASSET_EXISTS',
        message: 'A media asset version is still awaiting review.',
      });
    }
  }
}
