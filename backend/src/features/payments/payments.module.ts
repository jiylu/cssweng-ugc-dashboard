import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { UploadModule } from 'src/shared/upload/upload.module';

@Module({
  imports: [PrismaModule, CampaignsModule, UploadModule],
  providers: [PaymentsService],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
