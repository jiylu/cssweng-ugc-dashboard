import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../../campaign/campaigns/campaigns.service';
import { ProposalsService } from '../../campaign/proposals/proposals.service';
import { DeliverablesService } from '../../deliverable/deliverables/deliverables.service';
import { DeliverableItemsService } from '../../deliverable/deliverable-items/deliverable-items.service';
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
import { UpdateWrittenAssetActionDTO } from './dto/update-written-asset-action.dto';
import { UpdateWrittenAssetCommentDTO } from './dto/update-written-asset-comment.dto';

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

  async submitWrittenAsset(deliverableItemId: string, content: string) {
    this.logger.debug(`Submitting WrittenAsset for ${deliverableItemId}`);

    const result = this.prisma.$transaction(async (tx) => {
      const deliverableItem =
        await this.deliverableItemsService.findOneDeliverableItem(
          deliverableItemId,
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
          content: content,
        },
      });

      this.logger.log(
        `Created WrittenAsset ${writtenAsset.written_asset_id} (v${versionNumber}) for DeliverableItem ${writtenAsset.deliverable_item_id}`,
      );

      return writtenAsset;
    });

    return result;
  }

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Resolving written asset publicID ${publicId}`);

    const writtenAsset = await tx.writtenAssets.findFirst({
      where: { public_id: publicId },
      select: { written_asset_id: true },
    });

    if (!writtenAsset) {
      this.logger.warn(`WrittenAsset with publicId ${publicId} not found.`);

      throw new NotFoundException({
        code: 'WRITTEN_ASSET_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'WrittenAsset not found.',
      });
    }

    this.logger.log(
      `WrittenAsset publicID ${publicId} resolved: ${writtenAsset.written_asset_id}`,
    );

    return writtenAsset.written_asset_id;
  }

  async findOneWrittenAsset(
    writtenAssetId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding written asset ${writtenAssetId}`);

    const writtenAsset = await tx.writtenAssets.findUnique({
      where: { written_asset_id: writtenAssetId },
    });

    if (!writtenAsset) {
      this.logger.warn(`WrittenAsset with id ${writtenAssetId} not found.`);

      throw new NotFoundException({
        code: 'WRITTEN_ASSET_NOT_FOUND',
        message: 'WrittenAsset not found.',
      });
    }

    this.logger.log(`WrittenAsset ${writtenAssetId} found.`);

    return writtenAsset;
  }

  async getWrittenAssetHistoryForDeliverableItem(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding written asset history for DeliverableItem ${deliverableItemId}`,
    );

    const writtenAssets = await tx.writtenAssets.findMany({
      where: { deliverable_item_id: deliverableItemId },
      orderBy: { version_number: 'asc' },
    });

    this.logger.log(
      `Found ${writtenAssets.length} written asset versions for DeliverableItem ${deliverableItemId}.`,
    );

    return writtenAssets;
  }

  async getLatestAssetHistoryForDeliverableItem(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding latest written asset version for DeliverableItem ${deliverableItemId}`,
    );

    const latestWrittenAsset = await this.findLatestWrittenAsset(
      deliverableItemId,
      tx,
    );

    if (!latestWrittenAsset) {
      this.logger.warn(
        `No written asset found for DeliverableItem ${deliverableItemId}.`,
      );

      throw new NotFoundException({
        code: 'WRITTEN_ASSET_NOT_FOUND',
        message: 'No written asset found for this deliverable item.',
      });
    }

    this.logger.log(
      `Latest written asset (v${latestWrittenAsset.version_number}) found for DeliverableItem ${deliverableItemId}.`,
    );

    return latestWrittenAsset;
  }

  async updateWrittenAssetAction(
    writtenAssetId: string,
    dto: UpdateWrittenAssetActionDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating action for written asset ${writtenAssetId}`);

    const writtenAsset = await this.findOneWrittenAsset(writtenAssetId, tx);

    if (writtenAsset.written_asset_action !== AssetActions.PENDING) {
      this.logger.warn(
        `Cannot update action for WrittenAsset ${writtenAssetId} since it is already ${writtenAsset.written_asset_action}.`,
      );

      throw new ConflictException({
        code: 'WRITTEN_ASSET_ACTION_CANNOT_BE_UPDATED',
        message:
          'Written asset action can only be updated while the action is PENDING.',
      });
    }

    const updated = await tx.writtenAssets.update({
      where: { written_asset_id: writtenAssetId },
      data: {
        written_asset_action: dto.action,
        updated_at: new Date(),
      },
    });

    this.logger.log(
      `Action updated to ${updated.written_asset_action} for written asset ${writtenAssetId}`,
    );

    return updated;
  }

  async updateWrittenAssetComments(
    writtenAssetId: string,
    dto: UpdateWrittenAssetCommentDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Updating client comments for written asset ${writtenAssetId}`,
    );

    await this.findOneWrittenAsset(writtenAssetId, tx);

    const updated = await tx.writtenAssets.update({
      where: { written_asset_id: writtenAssetId },
      data: {
        client_comments: dto.comment,
      },
    });

    this.logger.log(
      `Client comments updated for written asset ${writtenAssetId}`,
    );

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
