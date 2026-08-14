import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { WrittenAssetsModule } from '../../assets/written-assets/written-assets.module';
import { MediaAssetsModule } from '../../assets/media-assets/media-assets.module';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';
import { DeliverableSubmissionsController } from './deliverable-submissions.controller';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { DeliverableItemsModule } from '../deliverable-items/deliverable-items.module';
import { CampaignsModule } from '../../campaign/campaigns/campaigns.module';
import { UploadModule } from 'src/shared/upload/upload.module';
import { NotificationsModule } from '../../../shared/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    WrittenAssetsModule,
    MediaAssetsModule,
    DeliverablesModule,
    DeliverableItemsModule,
    CampaignsModule,
    UploadModule,
    NotificationsModule,
  ],
  providers: [DeliverableSubmissionsService],
  controllers: [DeliverableSubmissionsController],
})
export class DeliverableSubmissionsModule {}
