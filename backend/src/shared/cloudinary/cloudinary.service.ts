import { Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'videos', resource_type: 'video' },
        (
          error: UploadApiErrorResponse | undefined,
          result?: UploadApiResponse,
        ) => {
          if (error) {
            reject(new Error(error.message || 'Cloudinary upload failed'));
            return;
          }
          if (!result) {
            reject(new Error('Cloudinary upload returned no result'));
            return;
          }
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
