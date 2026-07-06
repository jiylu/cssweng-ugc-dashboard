import { Controller, Get, Param } from '@nestjs/common';
import { GiftedProductsService } from './gifted-products.service';

@Controller()
export class GiftedProductsController {
  constructor(private readonly giftedProductsService: GiftedProductsService) {}

  @Get(':giftedProductId')
  findOne(@Param('giftedProductId') giftedProductId: string) {
    return this.giftedProductsService.findOneGiftedProduct(giftedProductId);
  }

  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.giftedProductsService.findGiftedProductsForCampaign(campaignId);
  }
}
