import { Module } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CampaignsModule } from '../campaigns/campaigns.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { ProposalsController } from './proposals.controller';

@Module({
  imports: [PrismaModule, CampaignsModule, UsersModule],
  providers: [ProposalsService],
  controllers: [ProposalsController],
  exports: [ProposalsService],
})
export class ProposalsModule {}
