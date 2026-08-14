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
  @IsString({ message: 'Campaign ID must be a string.' })
  @IsNotEmpty({ message: 'Campaign ID is required.' })
  campaignId!: string;

  @ApiProperty({
    example: 'Usage rights buyout for paid ads for 3 months',
  })
  @IsString({ message: 'Add-on name must be a string.' })
  @IsNotEmpty({ message: 'Add-on name is required.' })
  @MaxLength(500, { message: 'Add-on name must not exceed 500 characters.' })
  addOnName!: string;

  @ApiProperty({
    example: 'Describe your add-on',
  })
  @IsString({ message: 'Description must be a string.' })
  @IsNotEmpty({ message: 'Description is required.' })
  @MaxLength(500, { message: 'Description must not exceed 500 characters.' })
  description!: string;

  @ApiProperty({ example: 2500 })
  @IsNumber({}, { message: 'Fee must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Fee must not be negative.' })
  fee!: number;

  @ApiProperty({ example: 'URBA' })
  @IsString({ message: 'Initials must be a string.' })
  @IsNotEmpty({ message: 'Initials are required.' })
  @MaxLength(10, { message: 'Initials must not exceed 10 characters.' })
  initials!: string;
}
