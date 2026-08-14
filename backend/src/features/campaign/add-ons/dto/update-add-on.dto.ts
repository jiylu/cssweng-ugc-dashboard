import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateAddOnDTO } from './create-add-on-dto';

export class UpdateAddOnDTO extends PartialType(
  OmitType(CreateAddOnDTO, ['campaignId'] as const),
) {}
