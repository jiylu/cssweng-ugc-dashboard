import { Expose, Type } from 'class-transformer';
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
  @Expose()
  @ApiProperty({ example: 'Skincare' })
  @IsString({ message: 'Category must be a string.' })
  @IsNotEmpty({ message: 'Category is required.' })
  @MaxLength(500, { message: 'Category must not exceed 500 characters.' })
  category!: string;

  @Expose()
  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO 8601 date string.' },
  )
  @IsNotEmpty({ message: 'Start date is required.' })
  startDate!: string;

  @Expose()
  @ApiProperty({ example: '2026-07-01T00:00:00.000Z' })
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string.' },
  )
  @IsNotEmpty({ message: 'End date is required.' })
  endDate!: string;

  @Expose()
  @ApiProperty({ example: 'Southeast Asia' })
  @IsString({ message: 'Territory must be a string.' })
  @IsNotEmpty({ message: 'Territory is required.' })
  @MaxLength(500, { message: 'Territory must not exceed 500 characters.' })
  territory!: string;

  @Expose()
  @ApiProperty({
    example: 'Brand A, Brand B, Brand C',
  })
  @IsString({ message: 'Brand list must be a string.' })
  @IsNotEmpty({ message: 'Brand list is required.' })
  @MaxLength(500, { message: 'Brand list must not exceed 500 characters.' })
  brandlist!: string;

  @Expose()
  @ApiProperty({ example: 5000 })
  @IsNumber({}, { message: 'Exclusivity fee must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Exclusivity fee must not be negative.' })
  exclusivity_fee!: number;
}
