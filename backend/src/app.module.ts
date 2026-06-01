import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [],
  controllers: [],
  providers: [PrismaModule],
})
export class AppModule {}
