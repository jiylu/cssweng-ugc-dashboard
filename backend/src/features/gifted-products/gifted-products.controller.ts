import { Controller, Get, Param } from '@nestjs/common';
import { GiftedProductsService } from './gifted-products.service';
import {
  ApiFindGiftedProductById,
  ApiFindGiftedProductsForCampaign,
} from './docs/gifted-products.controller.swagger';

@Controller()
export class GiftedProductsController {
  constructor(private readonly giftedProductsService: GiftedProductsService) {}

  @ApiFindGiftedProductById()
  @Get(':giftedProductId')
  findOne(@Param('giftedProductId') giftedProductId: string) {
    return this.giftedProductsService.findOneGiftedProduct(giftedProductId);
  }

  @ApiFindGiftedProductsForCampaign()
  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.giftedProductsService.findGiftedProductsForCampaign(campaignId);
  }
}
