import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { MediaAssetsService } from './media-assets.service';
import { MediaAssetsController } from './media-assets.controller';

@Module({
  imports: [PrismaModule, CampaignsModule, ProposalsModule, DeliverablesModule],
  providers: [MediaAssetsService],
  controllers: [MediaAssetsController],
  exports: [MediaAssetsService],
})
export class MediaAssetsModule {}
