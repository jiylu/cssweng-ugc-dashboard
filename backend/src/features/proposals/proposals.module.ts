import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProposalsController } from './proposals.controller';
import { NotificationsModule } from '../notifications/notifications.module';
import { ProposalHistoryService } from './proposal-history.service';

@Module({
  imports: [PrismaModule, CampaignsModule, UsersModule, NotificationsModule],
  providers: [ProposalsService, ProposalHistoryService],
  controllers: [ProposalsController],
  exports: [ProposalsService, ProposalHistoryService],
})
export class ProposalsModule {}

