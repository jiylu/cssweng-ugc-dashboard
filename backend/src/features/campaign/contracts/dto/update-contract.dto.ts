import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateContractDTO } from './create-contract.dto';

export class UpdateContractDTO extends PartialType(
  OmitType(CreateContractDTO, ['campaignId'] as const),
) {}
