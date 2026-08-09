import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [PrismaModule, CampaignsModule, NotificationsModule],
  providers: [ContractsService],
  controllers: [ContractsController],
  exports: [ContractsService],
})
export class ContractsModule {}
