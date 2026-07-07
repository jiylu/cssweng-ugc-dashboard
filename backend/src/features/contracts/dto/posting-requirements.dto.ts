import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PostingRequirementsDTO {
  @ApiProperty({ example: 12 })
  @IsInt()
  @Min(1)
  content_retention_months!: number;

  @ApiProperty({ example: '#ad, @brandhandle' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  partnership_tags!: string;
}
