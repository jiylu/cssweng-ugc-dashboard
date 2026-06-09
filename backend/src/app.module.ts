import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { ProposalsModule } from './features/proposals/proposals.module';
import { DeliverablesModule } from './features/deliverables/deliverables.module';

@Module({
  imports: [
    SupabaseModule,
    PrismaModule,
    UsersModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
