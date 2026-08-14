import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { WrittenAssetDraftsService } from './written-asset-drafts.service';
import { WrittenAssetDraftsController } from './written-asset-drafts.controller';
import { DeliverableItemsModule } from '../../deliverable/deliverable-items/deliverable-items.module';

@Module({
  imports: [PrismaModule, DeliverableItemsModule],
  providers: [WrittenAssetDraftsService],
  controllers: [WrittenAssetDraftsController],
})
export class WrittenAssetDraftsModule {}
