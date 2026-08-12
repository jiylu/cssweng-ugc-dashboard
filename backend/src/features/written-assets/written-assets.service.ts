import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalsService } from '../proposals/proposals.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { DeliverableItemsService } from '../deliverables/deliverable-items.service';
import {
  AssetActions,
  Campaigns,
  CampaignStatus,
  DeliverableItems,
  DeliverableItemStatus,
  Deliverables,
  DeliverableStatus,
  Prisma,
  Proposals,
  ProposalStatus,
  WrittenAssets,
} from '@prisma/client';
import { nanoid } from 'nanoid';
import { SubmitWrittenAssetDTO } from './dto/submit-written-asset.dto';

@Injectable()
export class WrittenAssetsService {
  private readonly logger = new Logger(WrittenAssetsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
    private proposalsService: ProposalsService,
    private deliverablesService: DeliverablesService,
    private deliverableItemsService: DeliverableItemsService,
  ) {}

  async submitWrittenAsset(dto: SubmitWrittenAssetDTO) {
    this.logger.debug(`Submitting WrittenAsset for ${dto.deliverableItemId}`);

    const result = this.prisma.$transaction(async (tx) => {
      const deliverableItem =
        await this.deliverableItemsService.findOneDeliverableItem(
          dto.deliverableItemId,
          tx,
        );

      this.assertDeliverableItemAssetsNotApproved(deliverableItem);

      const [deliverable, campaign, proposal] =
        await this.extractDeliverableCampaignProposal(
          deliverableItem.deliverable_id,
          tx,
        );

      this.assertWrittenAssetCanBeSubmitted(campaign, proposal);

      await this.assertNoPendingWrittenAsset(
        deliverableItem.deliverable_item_id,
        tx,
      );

      await this.deliverablesService.changeDeliverableStatus(
        deliverable.deliverable_id,
        DeliverableStatus.IN_PROGRESS,
        tx,
      );

      await this.deliverableItemsService.updateDeliverableItemStatus(
        deliverableItem.deliverable_item_id,
        DeliverableItemStatus.FOR_REVIEW,
        tx,
      );

      const existingCount = await tx.writtenAssets.count({
        where: { deliverable_item_id: deliverableItem.deliverable_item_id },
      });

      const versionNumber = existingCount + 1;
      const publicId = nanoid(10);

      const writtenAsset = await tx.writtenAssets.create({
        data: {
          deliverable_item_id: deliverableItem.deliverable_item_id,
          public_id: publicId,
          version_number: versionNumber,
          content: dto.content,
        },
      });

      this.logger.log(
        `Created WrittenAsset ${writtenAsset.written_asset_id} (v${versionNumber}) for DeliverableItem ${writtenAsset.deliverable_item_id}`,
      );

      return writtenAsset;
    });

    return result;
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

  assertDeliverableItemAssetsNotApproved(deliverableItem: DeliverableItems) {
    if (deliverableItem.written_asset_approved) {
      this.logger.warn(
        `Cannot submit written asset for DeliverableItem ${deliverableItem.deliverable_item_id} since written asset is already approved.`,
      );

      throw new ConflictException({
        code: 'WRITTEN_ASSET_ALREADY_APPROVED',
        message: 'Written asset is already approved.',
      });
    }

    if (deliverableItem.media_asset_approved) {
      this.logger.warn(
        `Cannot submit written asset for DeliverableItem ${deliverableItem.deliverable_item_id} since media asset is already approved.`,
      );

      throw new ConflictException({
        code: 'MEDIA_ASSET_ALREADY_APPROVED',
        message: 'Cannot submit written asset with approved media asset.',
      });
    }
  }

  assertWrittenAssetCanBeSubmitted(campaign: Campaigns, proposal: Proposals) {
    if (
      campaign.campaign_status !== CampaignStatus.ACTIVE ||
      proposal.proposal_status !== ProposalStatus.ACCEPTED
    ) {
      this.logger.warn(
        `Cannot submit written asset since campaign ${campaign.campaign_id} is not ACTIVE or its proposal is not ACCEPTED.`,
      );

      throw new ConflictException({
        code: 'WRITTEN_ASSET_CANNOT_BE_SUBMITTED',
        message: 'Written asset cannot be submitted.',
      });
    }
  }

  async findLatestWrittenAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ): Promise<WrittenAssets | null> {
    return tx.writtenAssets.findFirst({
      where: { deliverable_item_id: deliverableItemId },
      orderBy: { version_number: 'desc' },
    });
  }

  async assertNoPendingWrittenAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    const latestWrittenAsset = await this.findLatestWrittenAsset(
      deliverableItemId,
      tx,
    );

    if (
      latestWrittenAsset &&
      latestWrittenAsset.written_asset_action === AssetActions.PENDING
    ) {
      this.logger.warn(
        `Cannot submit written asset for DeliverableItem ${deliverableItemId} since a previous version is still awaiting review.`,
      );

      throw new ConflictException({
        code: 'PENDING_WRITTEN_ASSET_EXISTS',
        message: 'A written asset version is still awaiting review.',
      });
    }
  }
}
