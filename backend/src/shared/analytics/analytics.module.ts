import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../../features/campaign/campaigns/campaigns.module';
import { ProposalsModule } from '../../features/campaign/proposals/proposals.module';
import { UsersModule } from '../../features/user/users/users.module';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';

@Module({
  imports: [PrismaModule, CampaignsModule, ProposalsModule, UsersModule],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
