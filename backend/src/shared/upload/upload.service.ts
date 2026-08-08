import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { SupabaseStorageService } from '../supabase-storage/supabase-storage.service';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    private readonly supabaseStorageService: SupabaseStorageService,
  ) {}

  async upload(
    file: Express.Multer.File,
  ): Promise<{ url: string; type: 'image' | 'video' }> {
    if (file.mimetype.startsWith('image/')) {
      const result = await this.supabaseStorageService.upload(file);

      return {
        url: result.publicUrl,
        type: 'image',
      };
    }

    if (file.mimetype.startsWith('video/')) {
      const result = await this.cloudinaryService.uploadVideo(file);
      return {
        url: result.secure_url,
        type: 'video',
      };
    }

    throw new BadRequestException({
      code: 'UNSUPPORTED_FILE_TYPE',
      message: 'Unsupported file type.',
    });
  }
}
