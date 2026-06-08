import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { CampaignsModule } from './features/campaigns/campaigns.module';
import { ProposalsModule } from './features/proposals/proposals.module';

@Module({
  imports: [
    SupabaseModule,
    PrismaModule,
    UsersModule,
    CampaignsModule,
    ProposalsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
