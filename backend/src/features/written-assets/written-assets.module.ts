import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { WrittenAssetsService } from './written-assets.service';

@Module({
  imports: [PrismaModule, CampaignsModule, ProposalsModule, DeliverablesModule],
  providers: [WrittenAssetsService],
  exports: [WrittenAssetsService],
})
export class WrittenAssetsModule {}
