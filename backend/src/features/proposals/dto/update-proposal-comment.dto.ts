import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateProposalCommentDTO {
  @ApiProperty({
    example:
      'Thank you for the proposal. Please adjust the timeline and resubmit.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(500)
  comment!: string;
}
