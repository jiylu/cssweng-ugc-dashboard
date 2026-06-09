import { ProposalStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateProposalStatusDTO {
  @IsEnum(ProposalStatus)
  @IsNotEmpty()
  proposalStatus!: ProposalStatus;
}
