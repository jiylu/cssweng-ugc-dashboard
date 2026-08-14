import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { WrittenAssetDraftsService } from './written-asset-drafts.service';
import { WrittenAssetDraftsController } from './written-asset-drafts.controller';
import { WrittenAssetsModule } from '../written-assets/written-assets.module';

@Module({
  imports: [PrismaModule, WrittenAssetsModule],
  providers: [WrittenAssetDraftsService],
  controllers: [WrittenAssetDraftsController],
})
export class WrittenAssetDraftsModule {}
