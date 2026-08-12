import { Controller, Get, Param } from '@nestjs/common';
import { WrittenAssetsService } from './written-assets.service';
import { DeliverableItemsService } from '../deliverables/deliverable-items.service';
import { plainToInstance } from 'class-transformer';
import { WrittenAssetsEntity } from './entities/written-assets.entity';
import {
  ApiFindWrittenAsset,
  ApiGetLatestWrittenAssetForDeliverableItem,
  ApiGetWrittenAssetHistoryForDeliverableItem,
} from './docs/written-assets.controller.swagger';

@Controller('written-assets')
export class WrittenAssetsController {
  constructor(
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly deliverableItemsService: DeliverableItemsService,
  ) {}

  @ApiFindWrittenAsset()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const writtenAssetId =
      await this.writtenAssetsService.resolvePublicId(publicId);
    const writtenAsset =
      await this.writtenAssetsService.findOneWrittenAsset(writtenAssetId);

    return plainToInstance(WrittenAssetsEntity, writtenAsset);
  }

  @ApiGetWrittenAssetHistoryForDeliverableItem()
  @Get('history/:deliverableItemPublicId')
  async getWrittenAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    const history =
      await this.writtenAssetsService.getWrittenAssetHistoryForDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(WrittenAssetsEntity, history);
  }

  @ApiGetLatestWrittenAssetForDeliverableItem()
  @Get('latest/:deliverableItemPublicId')
  async getLatestAssetHistoryForDeliverableItem(
    @Param('deliverableItemPublicId') deliverableItemPublicId: string,
  ) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(
        deliverableItemPublicId,
      );
    const latest =
      await this.writtenAssetsService.getLatestAssetHistoryForDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(WrittenAssetsEntity, latest);
  }
}
