import {
  BadRequestException,
  ConflictException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { DeliverableItemStatus, Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { DeliverablesService } from '../deliverables/deliverables.service';

@Injectable()
export class DeliverableItemsService {
  private readonly logger = new Logger(DeliverableItemsService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => DeliverablesService))
    private deliverableService: DeliverablesService,
  ) {}

  async createDeliverableItem(
    deliverableId: string,
    index: number,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating deliverable item for ${deliverableId}, index ${index}`,
    );

    const publicId = nanoid(10);

    const deliverableItem = await tx.deliverableItems.create({
      data: {
        deliverable_id: deliverableId,
        public_id: publicId,
        deliverable_index: index,
      },
    });

    this.logger.log(
      `Created deliverable item ${deliverableItem.deliverable_item_id} index ${deliverableItem.deliverable_index} for deliverable ${deliverableItem.deliverable_id}`,
    );

    return deliverableItem;
  }

  async createManyDeliverableItems(
    deliverableId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Creating deliverable items for ${deliverableId}`);

    const deliverable = await this.deliverableService.findOneDeliverableByUID(
      deliverableId,
      tx,
    );

    this.logger.debug(`Creating ${deliverable.quantity} deliverable items...`);

    const items = await Promise.all(
      Array.from({ length: deliverable.quantity }, (_, i) =>
        this.createDeliverableItem(deliverableId, i + 1, tx),
      ),
    );

    this.logger.log(
      `Successfully created ${items.length} deliverable items for deliverable ${deliverable.deliverable_id}`,
    );

    return items;
  }

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Resolving deliverableItem publicID ${publicId}`);

    const deliverableItem = await tx.deliverableItems.findFirst({
      where: {
        public_id: publicId,
        deliverable_item_status: {
          not: 'DELETED',
        },
      },
      select: {
        deliverable_item_id: true,
      },
    });

    if (!deliverableItem) {
      this.logger.warn(
        `DeliverableItem with publicId ${publicId} not found or is deleted.`,
      );

      throw new NotFoundException({
        code: 'DELIVERABLE_ITEM_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'DeliverableItem not found.',
      });
    }

    this.logger.log(
      `DeliverableItem publicID ${publicId} resolved ${deliverableItem.deliverable_item_id}`,
    );

    return deliverableItem.deliverable_item_id;
  }

  async findOneDeliverableItem(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding deliverable item ${deliverableItemId}`);

    const deliverableItem = await tx.deliverableItems.findFirst({
      where: {
        deliverable_item_id: deliverableItemId,
        deliverable_item_status: {
          not: 'DELETED',
        },
      },
    });

    if (!deliverableItem) {
      this.logger.warn(
        `DeliverableItem with id ${deliverableItemId} not found or is deleted.`,
      );

      throw new NotFoundException({
        code: 'DELIVERABLE_ITEM_NOT_FOUND',
        message: 'DeliverableItem not found.',
      });
    }

    this.logger.log(
      `Found DeliverableItem ${deliverableItem.deliverable_item_id} for Deliverable ${deliverableItem.deliverable_id} index ${deliverableItem.deliverable_index}`,
    );

    return deliverableItem;
  }

  async findDeliverableItemsForDeliverable(
    deliverableId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding deliverable items for deliverable  ${deliverableId}`,
    );

    const deliverable = await this.deliverableService.findOneDeliverableByUID(
      deliverableId,
      tx,
    );

    const deliverableItems = await tx.deliverableItems.findMany({
      where: {
        deliverable_id: deliverable.deliverable_id,
        deliverable_item_status: {
          not: 'DELETED',
        },
      },
      orderBy: [{ deliverable_index: 'asc' }],
    });

    this.logger.log(
      `Found ${deliverableItems.length} DeliverableItems for Deliverable ${deliverable.deliverable_id}`,
    );

    return deliverableItems;
  }

  async updateDeliverableItemStatus(
    deliverableItemId: string,
    status: DeliverableItemStatus,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Updating DeliverableItem ${deliverableItemId} status to ${status}`,
    );

    if (
      status === DeliverableItemStatus.DELETED ||
      status === DeliverableItemStatus.PENDING
    ) {
      throw new BadRequestException({
        code: 'DELIVERABLE_ITEM_INVALID_STATUS',
        message: 'Status must be APPROVED or FOR_REVIEW.',
      });
    }

    const deliverableItem = await this.findOneDeliverableItem(
      deliverableItemId,
      tx,
    );

    this.assertDeliverableItemNonTerminalStatus(
      deliverableItem.deliverable_item_status,
    );

    this.assertDeliverableItemCanBeApproved(status, deliverableItem);

    const updatedDeliverableItem = await tx.deliverableItems.update({
      where: { deliverable_item_id: deliverableItem.deliverable_item_id },
      data: {
        deliverable_item_status: status,
      },
    });

    this.logger.log(
      `Updated DeliverableItem ${deliverableItem.deliverable_item_id} status to ${updatedDeliverableItem.deliverable_item_status} from ${deliverableItem.deliverable_item_status}.`,
    );

    return updatedDeliverableItem;
  }

  async approveWrittenAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Setting written_asset_approved to true for ${deliverableItemId}`,
    );

    const deliverableItem = await this.findOneDeliverableItem(
      deliverableItemId,
      tx,
    );

    if (deliverableItem.written_asset_approved) {
      this.logger.warn(
        `written_asset_approved is already TRUE for ${deliverableItem.deliverable_item_id}`,
      );

      throw new ConflictException({
        code: 'WRITTEN_ASSET_ALREADY_APPROVED',
        message: 'Written asset is already approved.',
      });
    }

    const updatedDeliverableItem = await tx.deliverableItems.update({
      where: { deliverable_item_id: deliverableItem.deliverable_item_id },
      data: {
        written_asset_approved: true,
      },
    });

    this.logger.debug(
      `Successfully set written_asset_approved to true for ${deliverableItemId}`,
    );

    return updatedDeliverableItem;
  }

  async approveMediaAsset(
    deliverableItemId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Setting media_asset_approved to true for ${deliverableItemId}`,
    );

    const deliverableItem = await this.findOneDeliverableItem(
      deliverableItemId,
      tx,
    );

    if (!deliverableItem.written_asset_approved) {
      this.logger.warn(
        `written_asset_approved is still FALSE for ${deliverableItem.deliverable_item_id}`,
      );

      throw new BadRequestException({
        code: 'WRITTEN_ASSET_STILL_NOT_APPROVED',
        message:
          'Unable to approve media asset. Written asset is stil not approved.',
      });
    }

    if (deliverableItem.media_asset_approved) {
      this.logger.warn(
        `media_asset_approved is already TRUE for ${deliverableItem.deliverable_item_id}`,
      );

      throw new ConflictException({
        code: 'MEDIA_ASSET_ALREADY_APPROVED',
        message: 'Media asset is already approved.',
      });
    }

    const updatedDeliverableItem = await tx.deliverableItems.update({
      where: { deliverable_item_id: deliverableItem.deliverable_item_id },
      data: {
        media_asset_approved: true,
      },
    });

    this.logger.debug(
      `Successfully set media_asset_approved to true for ${deliverableItemId}`,
    );

    return updatedDeliverableItem;
  }

  async deleteAllDeliverableItemsForDeliverable(
    deliverableId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Deleting all deliverable items for deliverable ${deliverableId}`,
    );

    const deliverable = await this.deliverableService.findOneDeliverableByUID(
      deliverableId,
      tx,
    );

    const deletedDeliverableItems = await tx.deliverableItems.updateMany({
      where: { deliverable_id: deliverable.deliverable_id },
      data: {
        deliverable_item_status: DeliverableItemStatus.DELETED,
      },
    });

    this.logger.log(
      `Successfully deleted ${deletedDeliverableItems.count} deliverable items for deliverable ${deliverable.deliverable_id}`,
    );

    return deletedDeliverableItems;
  }

  assertDeliverableItemNonTerminalStatus(
    deliverableItemStatus: DeliverableItemStatus,
  ) {
    if (
      deliverableItemStatus === DeliverableItemStatus.APPROVED ||
      deliverableItemStatus === DeliverableItemStatus.DELETED
    ) {
      this.logger.warn(
        `Cannot update deliverable_item_status since it is already terminal.`,
      );

      throw new ConflictException({
        code: 'DELIVERABLE_ITEM_STATUS_CANNOT_BE_UPDATED',
        message: 'DeliverableItem status cannot be updated.',
      });
    }
  }

  assertDeliverableItemCanBeApproved(
    status: DeliverableItemStatus,
    deliverableItem: {
      deliverable_item_id: string;
      written_asset_approved: boolean;
      media_asset_approved: boolean;
    },
  ) {
    if (
      status === DeliverableItemStatus.APPROVED &&
      (!deliverableItem.written_asset_approved ||
        !deliverableItem.media_asset_approved)
    ) {
      this.logger.warn(
        `Cannot set DeliverableItem ${deliverableItem.deliverable_item_id} status to APPROVED since written_asset_approved and/or media_asset_approved is false.`,
      );

      throw new BadRequestException({
        code: 'DELIVERABLE_ITEM_ASSETS_NOT_APPROVED',
        message: 'Both written and media assets must be approved.',
      });
    }
  }
}
