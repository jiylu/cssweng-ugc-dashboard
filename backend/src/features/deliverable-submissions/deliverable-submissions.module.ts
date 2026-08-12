import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { WrittenAssetsModule } from '../written-assets/written-assets.module';
import { MediaAssetsModule } from '../media-assets/media-assets.module';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';
import { DeliverableSubmissionsController } from './deliverable-submissions.controller';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { CampaignsModule } from '../campaigns/campaigns.module';

@Module({
  imports: [
    PrismaModule,
    WrittenAssetsModule,
    MediaAssetsModule,
    DeliverablesModule,
    CampaignsModule,
  ],
  providers: [DeliverableSubmissionsService],
  controllers: [DeliverableSubmissionsController],
})
export class DeliverableSubmissionsModule {}
