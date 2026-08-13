import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { MediaAssetDraftsService } from './media-asset-drafts.service';
import { MediaAssetDraftsController } from './media-asset-drafts.controller';
import { MediaAssetsModule } from '../media-assets/media-assets.module';
import { UploadModule } from 'src/shared/upload/upload.module';

@Module({
  imports: [PrismaModule, MediaAssetsModule, UploadModule],
  providers: [MediaAssetDraftsService],
  controllers: [MediaAssetDraftsController],
})
export class MediaAssetDraftsModule {}
