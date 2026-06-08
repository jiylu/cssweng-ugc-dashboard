import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, CampaignsModule, UsersModule],
  providers: [ProposalsService],
  controllers: [],
})
export class ProposalsModule {}
