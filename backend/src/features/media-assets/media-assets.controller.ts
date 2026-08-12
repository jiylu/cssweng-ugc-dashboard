import { Controller, Get, Param } from '@nestjs/common';
import { MediaAssetsService } from './media-assets.service';
import { DeliverableItemsService } from '../deliverables/deliverable-items.service';

@Controller('media-assets')
export class MediaAssetsController {
  constructor(
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly deliverableItemsService: DeliverableItemsService,
  ) {}

  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);
    return this.mediaAssetsService.findOneMediaAsset(mediaAssetId);
  }

  @Get('history/:deliverableItemPublicId')
  async getMediaAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    return this.mediaAssetsService.getMediaAssetHistoryForDeliverableItem(
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
    return this.mediaAssetsService.getLatestAssetHistoryForDeliverableItem(
      deliverableItemId,
    );
  }
}
