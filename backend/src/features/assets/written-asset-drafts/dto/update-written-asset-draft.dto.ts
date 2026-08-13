import { PartialType, PickType } from '@nestjs/swagger';
import { CreateWrittenAssetDraftDto } from './create-written-asset-draft.dto';

export class UpdateWrittenAssetDraftDto extends PartialType(
  PickType(CreateWrittenAssetDraftDto, ['content'] as const),
) {}
