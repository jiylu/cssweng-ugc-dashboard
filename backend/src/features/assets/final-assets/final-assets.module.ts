import { Module } from '@nestjs/common';
import { CampaignsModule } from 'src/features/campaigns/campaigns.module';
import { DeliverablesModule } from 'src/features/deliverables/deliverables.module';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { FinalAssetsService } from './final-assets.service';
import { FinalAssetsController } from './final-assets.controller';

@Module({
  imports: [PrismaModule, CampaignsModule, DeliverablesModule],
  providers: [FinalAssetsService],
  controllers: [FinalAssetsController],
})
export class FinalAssetsModule {}
