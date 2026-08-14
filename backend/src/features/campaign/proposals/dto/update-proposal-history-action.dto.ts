import { ApiProperty } from '@nestjs/swagger';
import { ProposalActions } from '@prisma/client';
import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateProposalHistoryActionDTO {
  @ApiProperty({
    enum: [
      ProposalActions.REVISE,
      ProposalActions.APPROVE,
      ProposalActions.REJECT,
      ProposalActions.CANCEL,
    ],
    example: ProposalActions.APPROVE,
  })
  @IsEnum(ProposalActions, {
    message: 'Action must be a valid ProposalActions value.',
  })
  @IsIn(
    [
      ProposalActions.REVISE,
      ProposalActions.APPROVE,
      ProposalActions.REJECT,
      ProposalActions.CANCEL,
    ],
    {
      message: 'Action must be REVISE, APPROVE, REJECT, or CANCELLED.',
    },
  )
  @IsNotEmpty({ message: 'Action is required.' })
  action!: ProposalActions;
}
