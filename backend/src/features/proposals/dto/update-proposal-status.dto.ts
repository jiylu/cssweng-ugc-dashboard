import { ProposalStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProposalStatusDTO {
  @ApiProperty({ enum: ProposalStatus, example: ProposalStatus.PENDING })
  @IsEnum(ProposalStatus, { message: 'Proposal status must be a valid proposal status.' })
  @IsNotEmpty({ message: 'Proposal status is required.' })
  proposalStatus!: ProposalStatus;
}
