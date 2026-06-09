import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateProposalCommentDTO {
  @IsString()
  @IsNotEmpty()
  @MinLength(30)
  @MaxLength(500)
  comment!: string;
}
