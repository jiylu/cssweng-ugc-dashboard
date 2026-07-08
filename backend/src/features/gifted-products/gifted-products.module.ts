import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { GiftedProductsService } from './gifted-products.service';
import { GiftedProductsController } from './gifted-products.controller';

@Module({
  imports: [PrismaModule, CampaignsModule],
  providers: [GiftedProductsService],
  controllers: [GiftedProductsController],
  exports: [GiftedProductsService],
})
export class GiftedProductsModule {}
