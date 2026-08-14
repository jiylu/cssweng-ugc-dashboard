import { Injectable, Logger } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
  private readonly logger = new Logger(CloudinaryService.name);

  uploadVideo(file: Express.Multer.File): Promise<UploadApiResponse> {
    this.logger.debug(
      `Uploading video ${file.originalname} (${file.size} bytes)`,
    );

    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        { folder: 'videos', resource_type: 'video' },
        (
          error: UploadApiErrorResponse | undefined,
          result?: UploadApiResponse,
        ) => {
          if (error) {
            this.logger.error(
              `Video upload failed for ${file.originalname}: ${error.message}`,
            );
            reject(new Error(error.message || 'Cloudinary upload failed'));
            return;
          }
          if (!result) {
            this.logger.error(
              `Video upload returned no result for ${file.originalname}`,
            );
            reject(new Error('Cloudinary upload returned no result'));
            return;
          }
          this.logger.log(
            `Uploaded video ${file.originalname} -> ${result.secure_url}`,
          );
          resolve(result);
        },
      );
      toStream(file.buffer).pipe(upload);
    });
  }
}
