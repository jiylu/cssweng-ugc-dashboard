import { Controller, Get, Param } from '@nestjs/common';
import { MediaAssetsService } from './media-assets.service';
import { DeliverableItemsService } from '../deliverable-items/deliverable-items.service';
import { plainToInstance } from 'class-transformer';
import { MediaAssetsEntity } from './entities/media-assets.entity';
import {
  ApiFindMediaAsset,
  ApiGetLatestMediaAssetForDeliverableItem,
  ApiGetMediaAssetHistoryForDeliverableItem,
} from './docs/media-assets.controller.swagger';

@Controller('media-assets')
export class MediaAssetsController {
  constructor(
    private readonly mediaAssetsService: MediaAssetsService,
    private readonly deliverableItemsService: DeliverableItemsService,
  ) {}

  @ApiFindMediaAsset()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const mediaAssetId =
      await this.mediaAssetsService.resolvePublicId(publicId);
    const mediaAsset =
      await this.mediaAssetsService.findOneMediaAsset(mediaAssetId);

    return plainToInstance(MediaAssetsEntity, mediaAsset);
  }

  @ApiGetMediaAssetHistoryForDeliverableItem()
  @Get('history/:deliverableItemPublicId')
  async getMediaAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    const history =
      await this.mediaAssetsService.getMediaAssetHistoryForDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(MediaAssetsEntity, history);
  }

  @ApiGetLatestMediaAssetForDeliverableItem()
  @Get('latest/:deliverableItemPublicId')
  async getLatestAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    const latest =
      await this.mediaAssetsService.getLatestAssetHistoryForDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(MediaAssetsEntity, latest);
  }
}
