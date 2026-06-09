import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DeliverablesService } from './deliverables.service';
import { DeliverablesController } from './deliverables.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CampaignsModule],
  providers: [DeliverablesService],
  controllers: [DeliverablesController],
  exports: [DeliverablesService],
})
export class DeliverablesModule {}
