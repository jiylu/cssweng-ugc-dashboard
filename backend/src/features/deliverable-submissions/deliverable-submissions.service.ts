import { Injectable, Logger } from '@nestjs/common';
import { SubmitWrittenAssetDTO } from '../written-assets/dto/submit-written-asset.dto';
import { SubmitMediaAssetDTO } from '../media-assets/dto/submit-media-asset.dto';
import { UpdateWrittenAssetCommentDTO } from '../written-assets/dto/update-written-asset-comment.dto';
import { UpdateMediaAssetCommentDTO } from '../media-assets/dto/update-media-asset-comment.dto';
import { WrittenAssetsService } from '../written-assets/written-assets.service';
import { MediaAssetsService } from '../media-assets/media-assets.service';
import {
  AssetActions,
  DeliverableItemStatus,
  DeliverableItems,
  DeliverableStatus,
  Deliverables,
  Prisma,
} from '@prisma/client';
import { DeliverableItemsService } from '../deliverable-items/deliverable-items.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';

@Injectable()
export class DeliverableSubmissionsService {
  private readonly logger = new Logger(DeliverableSubmissionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly deliverableItemsService: DeliverableItemsService,
    private readonly deliverablesService: DeliverablesService,
    private readonly campaignsService: CampaignsService,
  ) {}

  async submitWrittenAsset(dto: SubmitWrittenAssetDTO) {
    return await this.writtenAssetsService.submitWrittenAsset(dto);
  }

  async submitMediaAsset(dto: SubmitMediaAssetDTO) {
    return await this.mediaAssetsService.submitMediaAsset(dto);
  }

  async approveWrittenAsset(writtenAssetId: string) {
    this.logger.debug(`Approving written asset ${writtenAssetId}`);

    const result = this.prisma.$transaction(async (tx) => {
      const writtenAsset = await this.writtenAssetsService.findOneWrittenAsset(
        writtenAssetId,
        tx,
      );

      this.logger.log(
        `Found WrittenAsset ${writtenAsset.written_asset_id} for approval`,
      );

      const deliverableItem =
        await this.deliverableItemsService.findOneDeliverableItem(
          writtenAsset.deliverable_item_id,
          tx,
        );

      const updatedWrittenAsset =
        await this.writtenAssetsService.updateWrittenAssetAction(
          writtenAsset.written_asset_id,
          {
            action: AssetActions.APPROVE,
          },
          tx,
        );

      this.logger.log(
        `Updated WrittenAsset ${updatedWrittenAsset.written_asset_id} action to ${updatedWrittenAsset.written_asset_action}`,
      );

      await this.deliverableItemsService.approveWrittenAsset(
        deliverableItem.deliverable_item_id,
        tx,
      );

      this.logger.log(
        `Successfully approved written asset ${writtenAsset.written_asset_id} for DeliverableItem ${deliverableItem.deliverable_item_id}`,
      );

      return updatedWrittenAsset;
    });

    return result;
  }

  async reviseWrittenAsset(
    writtenAssetId: string,
    dto: UpdateWrittenAssetCommentDTO,
  ) {
    this.logger.debug(`Revising written asset ${writtenAssetId}`);

    const result = this.prisma.$transaction(async (tx) => {
      await this.writtenAssetsService.updateWrittenAssetComments(
        writtenAssetId,
        dto,
        tx,
      );

      const revisedWrittenAsset =
        await this.writtenAssetsService.updateWrittenAssetAction(
          writtenAssetId,
          { action: AssetActions.REVISE },
          tx,
        );

      this.logger.log(
        `Successfully revised written asset ${writtenAssetId} to ${revisedWrittenAsset.written_asset_action}`,
      );

      return revisedWrittenAsset;
    });

    return result;
  }

  async reviseMediaAsset(
    mediaAssetId: string,
    dto: UpdateMediaAssetCommentDTO,
  ) {
    this.logger.debug(`Revising media asset ${mediaAssetId}`);

    const result = this.prisma.$transaction(async (tx) => {
      await this.mediaAssetsService.updateMediaAssetComments(
        mediaAssetId,
        dto,
        tx,
      );

      const revisedMediaAsset =
        await this.mediaAssetsService.updateMediaAssetAction(
          mediaAssetId,
          { action: AssetActions.REVISE },
          tx,
        );

      this.logger.log(
        `Successfully revised media asset ${mediaAssetId} to ${revisedMediaAsset.media_asset_action}`,
      );

      return revisedMediaAsset;
    });

    return result;
  }

  async approveMediaAsset(mediaAssetId: string) {
    this.logger.debug(`Approving media asset ${mediaAssetId}`);

    const result = this.prisma.$transaction(async (tx) => {
      const mediaAsset = await this.mediaAssetsService.findOneMediaAsset(
        mediaAssetId,
        tx,
      );

      const deliverableItem =
        await this.deliverableItemsService.findOneDeliverableItem(
          mediaAsset.deliverable_item_id,
          tx,
        );

      const updatedMediaAsset =
        await this.mediaAssetsService.updateMediaAssetAction(
          mediaAsset.media_asset_id,
          { action: AssetActions.APPROVE },
          tx,
        );

      await this.deliverableItemsService.approveMediaAsset(
        deliverableItem.deliverable_item_id,
        tx,
      );

      await this.approveDeliverableIfAssetsApproved(deliverableItem, tx);

      this.logger.log(
        `Successfully approved media asset ${mediaAsset.media_asset_id} for DeliverableItem ${deliverableItem.deliverable_item_id}`,
      );

      return updatedMediaAsset;
    });

    return result;
  }

  private async approveDeliverableIfAssetsApproved(
    deliverableItem: DeliverableItems,
    tx: Prisma.TransactionClient | PrismaService,
  ) {
    const deliverableItems =
      await this.deliverableItemsService.findDeliverableItemsForDeliverable(
        deliverableItem.deliverable_id,
        tx,
      );

    const allAssetsApproved =
      deliverableItems.length > 0 &&
      deliverableItems.every(
        (item) => item.written_asset_approved && item.media_asset_approved,
      );

    if (!allAssetsApproved) {
      return;
    }

    this.logger.log(
      `All DeliverableItems for Deliverable ${deliverableItem.deliverable_id} have approved written and media assets. Setting deliverable status to APPROVED.`,
    );

    await Promise.all(
      deliverableItems.map((item) =>
        this.deliverableItemsService.updateDeliverableItemStatus(
          item.deliverable_item_id,
          DeliverableItemStatus.APPROVED,
          tx,
        ),
      ),
    );

    const updatedDeliverable =
      await this.deliverablesService.changeDeliverableStatus(
        deliverableItem.deliverable_id,
        DeliverableStatus.APPROVED,
        tx,
      );

    await this.approveCampaignIfAllDeliverablesApproved(updatedDeliverable, tx);
  }

  private async approveCampaignIfAllDeliverablesApproved(
    deliverable: Deliverables,
    tx: Prisma.TransactionClient | PrismaService,
  ) {
    const campaignDeliverables =
      await this.deliverablesService.findDeliverablesForCampaign(
        deliverable.campaign_id,
        tx,
      );

    const allDeliverablesApproved =
      campaignDeliverables.length > 0 &&
      campaignDeliverables.every(
        (d) => d.deliverable_status === DeliverableStatus.APPROVED,
      );

    if (!allDeliverablesApproved) {
      return;
    }

    this.logger.log(
      `All deliverables for Campaign ${deliverable.campaign_id} are APPROVED. Setting all_deliverables_approved.`,
    );

    await this.campaignsService.updateAllDeliverablesApproved(
      deliverable.campaign_id,
      tx,
    );
  }
}
