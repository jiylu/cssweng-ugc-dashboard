import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UsersModule } from '../users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [PrismaModule, UsersModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports: [NotificationsService],
})
export class NotificationsModule {}
