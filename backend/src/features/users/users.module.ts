import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { AuthSessionMiddleware } from './middleware/auth-session.middleware';

@Module({
  imports: [PrismaModule, SupabaseModule],
  providers: [UserService, AuthSessionMiddleware],
  controllers: [UserController],
  exports: [UserService],
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthSessionMiddleware).forRoutes({
      path: 'users/me',
      method: RequestMethod.GET,
    });
  }
}
