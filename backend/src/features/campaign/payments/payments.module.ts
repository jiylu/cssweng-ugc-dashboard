import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { UploadModule } from 'src/shared/upload/upload.module';
import { ProposalsModule } from '../proposals/proposals.module';
import { NotificationsModule } from '../../../shared/notifications/notifications.module';

@Module({
  imports: [
    PrismaModule,
    CampaignsModule,
    UploadModule,
    ProposalsModule,
    NotificationsModule,
  ],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
