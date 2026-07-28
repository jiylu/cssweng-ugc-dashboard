import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class PostingRequirementsDTO {
  @Expose()
  @ApiProperty({ example: 12 })
  @IsInt({ message: 'Content retention must be an integer (months).' })
  @Min(1, { message: 'Content retention must be at least 1 month.' })
  content_retention_months!: number;

  @Expose()
  @ApiProperty({ example: '#ad, @brandhandle' })
  @IsString({ message: 'Partnership tags must be a string.' })
  @IsNotEmpty({ message: 'Partnership tags are required.' })
  @MaxLength(250, {
    message: 'Partnership tags must not exceed 250 characters.',
  })
  partnership_tags!: string;
}
