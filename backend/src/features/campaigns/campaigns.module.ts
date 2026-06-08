import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CampaignsService } from './campaigns.service';
import { CampaignsController } from './campaigns.controller';
import { UserService } from '../users/users.service';

@Module({
  imports: [PrismaModule],
  providers: [CampaignsService, UserService],
  controllers: [CampaignsController],
})
export class CampaignsModule {}
