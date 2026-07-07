import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { CampaignSetupService } from './campaign-setup.service';
import { CampaignSetupController } from './campaign-setup.controller';
import { EmailModule } from '../email/email.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { ContractsModule } from '../contracts/contracts.module';
import { AddOnsModule } from '../add-ons/add-ons.module';
import { GiftedProductsModule } from '../gifted-products/gifted-products.module';

@Module({
  imports: [
    PrismaModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
    EmailModule,
    ActivityLogModule,
    ContractsModule,
    AddOnsModule,
    GiftedProductsModule,
  ],
  providers: [CampaignSetupService],
  controllers: [CampaignSetupController],
})
export class CampaignSetupModule {}
