import { UploadService } from './upload.service';
import { SupabaseStorageModule } from '../supabase-storage/supabase-storage.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [SupabaseStorageModule, CloudinaryModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
