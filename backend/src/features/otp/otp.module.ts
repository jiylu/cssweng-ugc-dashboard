import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
