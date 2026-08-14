import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from '../../../shared/prisma/prisma.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { SupabaseModule } from 'src/shared/supabase/supabase.module';
import { AuthSessionMiddleware } from './middleware/auth-session.middleware';
import { OtpModule } from '../otp/otp.module';
import { SupabaseStorageModule } from 'src/shared/supabase-storage/supabase-storage.module';
import { EmailModule } from '../../../shared/email/email.module';

@Module({
  imports: [
    PrismaModule,
    SupabaseModule,
    SupabaseStorageModule,
    OtpModule,
    EmailModule,
  ],
  providers: [UserService, AuthSessionMiddleware],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSessionMiddleware)
      .exclude(
        { path: 'users', method: RequestMethod.POST },
        { path: 'users/login', method: RequestMethod.POST },
        { path: 'users/forgot-password', method: RequestMethod.POST },
        { path: 'users/reset-password', method: RequestMethod.POST },
        { path: 'users/:userId', method: RequestMethod.GET },
        { path: 'otps', method: RequestMethod.POST },
        { path: 'otps/validate', method: RequestMethod.POST },
        { path: 'otps/guest', method: RequestMethod.POST },
        { path: 'otps/guest/validate', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
