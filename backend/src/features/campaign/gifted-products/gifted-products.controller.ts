import { Controller, Get, Param } from '@nestjs/common';
import { GiftedProductsService } from './gifted-products.service';
import {
  ApiFindGiftedProductById,
  ApiFindGiftedProductsForCampaign,
} from './docs/gifted-products.controller.swagger';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { GiftedProductsEntity } from './entities/gifted-products.entity';

@Controller('gifted-products')
export class GiftedProductsController {
  constructor(
    private readonly giftedProductsService: GiftedProductsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindGiftedProductById()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const giftedProductId =
      await this.giftedProductsService.resolvePublicId(publicId);
    const giftedProduct =
      await this.giftedProductsService.findOneGiftedProduct(giftedProductId);

    return plainToInstance(GiftedProductsEntity, giftedProduct);
  }

  @ApiFindGiftedProductsForCampaign()
  @Get('/campaign/:publicId')
  async findMany(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const giftedProducts =
      await this.giftedProductsService.findGiftedProductsForCampaign(
        campaignId,
      );

    return plainToInstance(GiftedProductsEntity, giftedProducts);
  }
}
