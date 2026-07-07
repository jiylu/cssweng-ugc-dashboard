import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateGiftedProductDTO } from './create-gifted-product.dto';

export class UpdateGiftedProductDTO extends PartialType(
  OmitType(CreateGiftedProductDTO, ['campaignId'] as const),
) {}
