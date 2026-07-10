import { ApiPropertyOptional } from '@nestjs/swagger';
import { CampaignCurrency } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class UpdateCampaignDetailsDTO {
  @ApiPropertyOptional({ example: 'Updated Project Name' })
  @IsOptional()
  @IsString({ message: 'Project name must be a string.' })
  @MaxLength(150, { message: 'Project name must not exceed 150 characters.' })
  projectName?: string;

  @ApiPropertyOptional({ example: 'Updated campaign description.' })
  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(600, { message: 'Description must not exceed 600 characters.' })
  description?: string;

  @ApiPropertyOptional({
    enum: CampaignCurrency,
    example: CampaignCurrency.PHP,
  })
  @IsOptional()
  @IsEnum(CampaignCurrency, { message: 'Currency must be a valid campaign currency.' })
  currency?: CampaignCurrency;

  @ApiPropertyOptional({
    example: 12,
    description: 'Tax percentage to apply to subtotal.',
  })
  @IsOptional()
  @IsNumber({}, { message: 'Tax must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Tax must not be negative.' })
  tax?: number;

  @ApiPropertyOptional({ example: 55000.67 })
  @IsOptional()
  @IsNumber({}, { message: 'Pricing must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Pricing must not be negative.' })
  pricing?: number;

  @ApiPropertyOptional({ example: ['Instagram', 'Facebook', 'TikTok'] })
  @IsOptional()
  @IsArray({ message: 'Platforms must be an array of strings.' })
  @IsString({ each: true, message: 'Each platform must be a string.' })
  platforms?: string[];

  @ApiPropertyOptional({ example: '2026-06-07T00:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'Start date must be a valid ISO 8601 date string.' })
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString({}, { message: 'End date must be a valid ISO 8601 date string.' })
  endDate?: string;
}
