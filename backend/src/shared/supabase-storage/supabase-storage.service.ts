import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';
import { SupabaseService } from '../supabase/supabase.service';

type Database = any;
type StorageApi = ReturnType<
  SupabaseClient<Database, 'public', Database>['storage']['from']
>;

export interface SupabaseUploadResult {
  path: string;
  publicUrl: string;
  contentType: string;
  size: number;
}

@Injectable()
export class SupabaseStorageService {
  private readonly logger = new Logger(SupabaseStorageService.name);
  private readonly bucket: string;

  constructor(private readonly supabaseService: SupabaseService) {
    this.bucket = process.env.SUPABASE_STORAGE_BUCKET ?? 'uploads';
  }

  get client(): StorageApi {
    return this.supabaseService.client.storage.from(this.bucket);
  }

  private buildPath(file: Express.Multer.File, folder: string): string {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${nanoid(10)}-${safeName}`;
    return `${folder}/${filename}`;
  }

  async upload(
    file: Express.Multer.File,
    folder = 'uploads',
  ): Promise<SupabaseUploadResult> {
    if (!file || !file.buffer) {
      throw new BadRequestException({
        code: 'FILE_REQUIRED',
        message: 'File is required.',
      });
    }

    const path = this.buildPath(file, folder);

    const { data, error } = await this.client.upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      this.logger.error(`Supabase upload failed: ${error.message}`);
      throw new BadRequestException({
        code: 'UPLOAD_FAILED',
        message: error.message,
      });
    }

    const publicUrl = this.getPublicUrl(data.path);

    this.logger.log(`Uploaded file to ${data.path}`);
    return {
      path: data.path,
      publicUrl,
      contentType: file.mimetype,
      size: file.size,
    };
  }

  getPublicUrl(path: string): string {
    return this.client.getPublicUrl(path).data.publicUrl;
  }

  async createSignedUrl(path: string, expiresIn = 3600): Promise<string> {
    const { data, error } = await this.client.createSignedUrl(path, expiresIn);

    if (error) {
      this.logger.error(`Failed to create signed URL: ${error.message}`);
      throw new BadRequestException({
        code: 'SIGNED_URL_FAILED',
        message: error.message,
      });
    }

    return data.signedUrl;
  }
}
