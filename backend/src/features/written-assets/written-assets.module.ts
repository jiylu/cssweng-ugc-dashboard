import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { DeliverableItemsModule } from '../deliverable-items/deliverable-items.module';
import { WrittenAssetsService } from './written-assets.service';
import { WrittenAssetsController } from './written-assets.controller';

@Module({
  imports: [
    PrismaModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
    DeliverableItemsModule,
  ],
  providers: [WrittenAssetsService],
  controllers: [WrittenAssetsController],
  exports: [WrittenAssetsService],
})
export class WrittenAssetsModule {}
