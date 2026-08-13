import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { WrittenAssetsModule } from '../written-assets/written-assets.module';
import { MediaAssetsModule } from '../media-assets/media-assets.module';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';
import { DeliverableSubmissionsController } from './deliverable-submissions.controller';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { DeliverableItemsModule } from '../deliverable-items/deliverable-items.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { UploadModule } from 'src/shared/upload/upload.module';
import { NotificationsModule } from '../notifications/notifications.module';

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
