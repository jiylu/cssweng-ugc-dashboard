import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { ProposalsModule } from './features/proposals/proposals.module';
import { DeliverablesModule } from './features/deliverables/deliverables.module';
import { CampaignSetupModule } from './features/campaign-setup/campaign-setup.module';
import { ActivityLogModule } from './features/activity-log/activity-log.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
