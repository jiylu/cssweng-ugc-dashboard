import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverableItemsService } from './deliverable-items.service';

@Module({
  imports: [PrismaModule, CampaignsModule, ProposalsModule],
  providers: [DeliverablesService, DeliverableItemsService],
  controllers: [DeliverablesController],
  exports: [DeliverablesService],
})
export class DeliverablesModule {}
