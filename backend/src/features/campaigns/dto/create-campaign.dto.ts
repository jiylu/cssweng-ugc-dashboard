import { ApiProperty } from '@nestjs/swagger';
import { CampaignCurrency } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCampaignDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  ugcId!: string;

  @ApiProperty({ example: 'New Project' })
  @IsString()
  @MaxLength(150)
  projectName!: string;

  @ApiProperty({ example: 'This is my new project.' })
  @IsString()
  @MaxLength(600)
  description!: string;

  @ApiProperty({
    enum: CampaignCurrency,
    example: CampaignCurrency.PHP,
  })
  @IsEnum(CampaignCurrency)
  currency!: CampaignCurrency;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  tax!: number;

  @ApiProperty({ example: '55000.67' })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing!: number;

  @ApiProperty({ example: '["Instagram", "Facebook", "TikTok"]' })
  @IsArray()
  @IsString({ each: true })
  platforms!: string[];

  @ApiProperty({ example: '2026-06-07T00:00:00.000Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-06-10T00:00:00.000Z' })
  @IsDateString()
  endDate!: string;
}
