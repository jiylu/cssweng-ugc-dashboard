import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateWrittenAssetCommentDTO {
  @ApiProperty({
    example:
      'Thank you for the submission. Please adjust the caption and resubmit.',
  })
  @IsString({ message: 'Comment must be a string.' })
  @IsNotEmpty({ message: 'Comment is required.' })
  @MinLength(30, { message: 'Comment must be at least 30 characters.' })
  @MaxLength(500, { message: 'Comment must not exceed 500 characters.' })
  comment!: string;
}
