import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAddOnDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({
    example: 'Usage rights buyout for paid ads for 3 months',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  addOnName!: string;

  @ApiProperty({
    example: 'Describe your add-on',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description!: string;

  @ApiProperty({ example: 2500 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fee!: number;

  @ApiProperty({ example: 'URBA' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  initials!: string;
}
