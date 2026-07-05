import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { AddOnsController } from './add-ons.controller';
import { AddOnsService } from './add-ons.service';

@Module({
  imports: [CampaignsModule],
  providers: [AddOnsService],
  controllers: [AddOnsController],
  exports: [],
})
export class AddOnsModule {}
