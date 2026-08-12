import { Module } from '@nestjs/common';
import { WrittenAssetsModule } from '../written-assets/written-assets.module';
import { MediaAssetsModule } from '../media-assets/media-assets.module';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';
import { DeliverableSubmissionsController } from './deliverable-submissions.controller';

@Module({
  imports: [WrittenAssetsModule, MediaAssetsModule],
  providers: [DeliverableSubmissionsService],
  controllers: [DeliverableSubmissionsController],
})
export class DeliverableSubmissionsModule {}
