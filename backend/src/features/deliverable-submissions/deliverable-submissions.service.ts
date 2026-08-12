import { Injectable } from '@nestjs/common';
import { SubmitWrittenAssetDTO } from '../written-assets/dto/submit-written-asset.dto';
import { SubmitMediaAssetDTO } from '../media-assets/dto/submit-media-asset.dto';
import { WrittenAssetsService } from '../written-assets/written-assets.service';
import { MediaAssetsService } from '../media-assets/media-assets.service';

@Injectable()
export class DeliverableSubmissionsService {
  constructor(
    private readonly writtenAssetsService: WrittenAssetsService,
    private readonly mediaAssetsService: MediaAssetsService,
  ) {}

  submitWrittenAsset(dto: SubmitWrittenAssetDTO) {
    return this.writtenAssetsService.submitWrittenAsset(dto);
  }

  submitMediaAsset(dto: SubmitMediaAssetDTO) {
    return this.mediaAssetsService.submitMediaAsset(dto);
  }
}
