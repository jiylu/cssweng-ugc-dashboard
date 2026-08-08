import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { DraftsService } from './drafts.service';
import { DraftsController } from './drafts.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [DraftsService],
  controllers: [DraftsController],
})
export class DraftsModule {}
