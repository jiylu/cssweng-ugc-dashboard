import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { CampaignSetupService } from './campaign-setup.service';
import { CampaignSetupController } from './campaign-setup.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    PrismaModule,
    CampaignsModule,
    ProposalsModule,
    DeliverablesModule,
    EmailModule,
  ],
  providers: [CampaignSetupService],
  controllers: [CampaignSetupController],
})
export class CampaignSetupModule {}
