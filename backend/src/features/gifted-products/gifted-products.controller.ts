import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { GiftedProductsService } from './gifted-products.service';
import {
  ApiFindGiftedProductById,
  ApiFindGiftedProductsForCampaign,
  ApiUpdateGiftedProductDetails,
} from './docs/gifted-products.controller.swagger';
import { UpdateGiftedProductDTO } from './dto/update-gifted-product.dto';

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

  @ApiUpdateGiftedProductDetails()
  @Patch(':giftedProductId')
  updateDetails(
    @Param('giftedProductId') giftedProductId: string,
    @Body() dto: UpdateGiftedProductDTO,
  ) {
    return this.giftedProductsService.updateGiftedProductDetails(
      giftedProductId,
      dto,
    );
  }
}
