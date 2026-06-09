import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { DeliverablesService } from './deliverables.service';

@Module({
  imports: [CampaignsModule],
  providers: [DeliverablesService],
  controllers: [],
})
export class DeliverablesModule {}
