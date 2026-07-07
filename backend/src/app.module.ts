import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { ProposalsModule } from './features/proposals/proposals.module';
import { DeliverablesModule } from './features/deliverables/deliverables.module';
import { CampaignSetupModule } from './features/campaign-setup/campaign-setup.module';
import { ActivityLogModule } from './features/activity-log/activity-log.module';
import { AddOnsModule } from './features/add-ons/add-ons.module';
import { ContractsModule } from './features/contracts/contracts.module';
import { GiftedProductsModule } from './features/gifted-products/gifted-products.module';
import { NotificationsModule } from './features/notifications/notifications.module';

@Module({
  imports: [
    SupabaseModule,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
