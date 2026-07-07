import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ExclusivityDTO {
  @ApiProperty({ example: 'Skincare' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  category!: string;

  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @ApiProperty({ example: 'Southeast Asia' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  territory!: string;

  @ApiProperty({
    example: 'Brand A, Brand B, Brand C',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  brandlist!: string;

  @ApiProperty({ example: 5000 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  exclusivity_fee!: number;
}
