import { Module } from '@nestjs/common';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { AddOnsController } from './add-ons.controller';
import { AddOnsService } from './add-ons.service';
import { PrismaModule } from 'src/shared/prisma/prisma.module';

@Module({
  imports: [PrismaModule, CampaignsModule],
  providers: [AddOnsService],
  controllers: [AddOnsController],
  exports: [AddOnsService],
})
export class AddOnsModule {}
