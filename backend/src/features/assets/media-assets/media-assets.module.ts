import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../../campaign/campaigns/campaigns.module';
import { ProposalsModule } from '../../campaign/proposals/proposals.module';
import { DeliverablesModule } from '../../deliverable/deliverables/deliverables.module';
import { DeliverableItemsModule } from '../../deliverable/deliverable-items/deliverable-items.module';
import { FinalAssetsModule } from '../final-assets/final-assets.module';
import { MediaAssetsService } from './media-assets.service';
import { MediaAssetsController } from './media-assets.controller';

@Module({
  imports: [
    PrismaModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
    DeliverableItemsModule,
    FinalAssetsModule,
  ],
  providers: [MediaAssetsService],
  controllers: [MediaAssetsController],
  exports: [MediaAssetsService],
})
export class MediaAssetsModule {}
