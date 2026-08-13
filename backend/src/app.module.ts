import { Module } from '@nestjs/common';
import { PrismaModule } from './shared/prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './shared/supabase/supabase.module';
import { SupabaseStorageModule } from './shared/supabase-storage/supabase-storage.module';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { ProposalsModule } from './features/proposals/proposals.module';
import { DeliverablesModule } from './features/deliverables/deliverables.module';
import { CampaignSetupModule } from './features/campaign-setup/campaign-setup.module';
import { ActivityLogModule } from './features/activity-log/activity-log.module';
import { AddOnsModule } from './features/add-ons/add-ons.module';
import { ContractsModule } from './features/contracts/contracts.module';
import { GiftedProductsModule } from './features/gifted-products/gifted-products.module';
import { NotificationsModule } from './features/notifications/notifications.module';
import { AnalyticsModule } from './features/analytics/analytics.module';
import { OtpModule } from './features/otp/otp.module';
import { DraftsModule } from './features/drafts/drafts.module';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { UploadModule } from './shared/upload/upload.module';
import { PaymentsModule } from './features/payments/payments.module';
import { DeliverableSubmissionsModule } from './features/deliverable-submissions/deliverable-submissions.module';
import { WrittenAssetsModule } from './features/written-assets/written-assets.module';
import { MediaAssetsModule } from './features/media-assets/media-assets.module';
import { DeliverableItemsModule } from './features/deliverable-items/deliverable-items.module';
import { WrittenAssetDraftsModule } from './features/written-asset-drafts/written-asset-drafts.module';
import { MediaAssetDraftsModule } from './features/media-asset-drafts/media-asset-drafts.module';

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
