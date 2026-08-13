import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from '../../shared/prisma/prisma.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { SupabaseModule } from 'src/shared/supabase/supabase.module';
import { AuthSessionMiddleware } from './middleware/auth-session.middleware';
import { OtpModule } from '../otp/otp.module';
import { SupabaseStorageModule } from 'src/shared/supabase-storage/supabase-storage.module';

@Module({
  imports: [PrismaModule, SupabaseModule, SupabaseStorageModule, OtpModule],
  providers: [UserService, AuthSessionMiddleware],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthSessionMiddleware)
      .forRoutes(
        { path: 'users/me', method: RequestMethod.GET },
        { path: 'users/me', method: RequestMethod.PATCH },
        { path: 'users/me/profile-picture', method: RequestMethod.POST },
        { path: 'users/me/profile-picture', method: RequestMethod.DELETE },
      );
  }
}
