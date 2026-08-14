import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsersModule } from './features/user/users/users.module';
import { SupabaseModule } from './shared/supabase/supabase.module';
import { SupabaseStorageModule } from './shared/supabase-storage/supabase-storage.module';
import { CampaignsModule } from './features/campaign/campaigns/campaigns.module';
import { ProposalsModule } from './features/campaign/proposals/proposals.module';
import { DeliverablesModule } from './features/deliverable/deliverables/deliverables.module';
import { CampaignSetupModule } from './features/campaign/campaign-setup/campaign-setup.module';
import { ActivityLogModule } from './shared/activity-log/activity-log.module';
import { AddOnsModule } from './features/campaign/add-ons/add-ons.module';
import { ContractsModule } from './features/campaign/contracts/contracts.module';
import { GiftedProductsModule } from './features/campaign/gifted-products/gifted-products.module';
import { NotificationsModule } from './shared/notifications/notifications.module';
import { AnalyticsModule } from './shared/analytics/analytics.module';
import { OtpModule } from './features/user/otp/otp.module';
import { DraftsModule } from './features/campaign/drafts/drafts.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { UploadModule } from './shared/upload/upload.module';
import { PaymentsModule } from './features/campaign/payments/payments.module';
import { DeliverableSubmissionsModule } from './features/deliverable/deliverable-submissions/deliverable-submissions.module';
import { WrittenAssetsModule } from './features/assets/written-assets/written-assets.module';
import { MediaAssetsModule } from './features/assets/media-assets/media-assets.module';
import { DeliverableItemsModule } from './features/deliverable/deliverable-items/deliverable-items.module';
import { WrittenAssetDraftsModule } from './features/assets/written-asset-drafts/written-asset-drafts.module';
import { MediaAssetDraftsModule } from './features/assets/media-asset-drafts/media-asset-drafts.module';

@Module({
  imports: [
    SupabaseModule,
    SupabaseStorageModule,
    PrismaModule,
    UsersModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
    CampaignSetupModule,
    ActivityLogModule,
    AddOnsModule,
    ContractsModule,
    GiftedProductsModule,
    NotificationsModule,
    AnalyticsModule,
    OtpModule,
    DraftsModule,
    CloudinaryModule,
    UploadModule,
    PaymentsModule,
    DeliverableSubmissionsModule,
    WrittenAssetsModule,
    MediaAssetsModule,
    DeliverableItemsModule,
    WrittenAssetDraftsModule,
    MediaAssetDraftsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
