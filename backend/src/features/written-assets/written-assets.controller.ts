import { Controller, Get, Param } from '@nestjs/common';
import { WrittenAssetsService } from './written-assets.service';
import { DeliverableItemsService } from '../deliverables/deliverable-items.service';

@Controller('written-assets')
export class WrittenAssetsController {
  constructor(
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly deliverableItemsService: DeliverableItemsService,
  ) {}

  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);
    return this.writtenAssetsService.findOneWrittenAsset(writtenAssetId);
  }

  @Get('history/:deliverableItemPublicId')
  async getWrittenAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    return this.writtenAssetsService.getWrittenAssetHistoryForDeliverableItem(
      deliverableItemId,
    );
  }

  @Get('latest/:deliverableItemPublicId')
  async getLatestAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    return this.writtenAssetsService.getLatestAssetHistoryForDeliverableItem(
      deliverableItemId,
    );
  }
}
