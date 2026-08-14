import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { UsersModule } from '../../user/users/users.module';
import { NotificationsModule } from 'src/shared/notifications/notifications.module';

@Module({
  imports: [PrismaModule, UsersModule, NotificationsModule],
  providers: [CampaignsService],
  controllers: [CampaignsController],
  exports: [CampaignsService],
})
export class CampaignsModule {}
