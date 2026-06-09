import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './features/users/users.module';
import { SupabaseModule } from './supabase/supabase.module';

@Module({
  imports: [SupabaseModule, PrismaModule, UsersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
