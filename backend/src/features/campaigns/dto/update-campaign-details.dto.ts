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
  @IsString()
  @MaxLength(150)
  projectName?: string;

  @ApiPropertyOptional({ example: 'Updated campaign description.' })
  @IsOptional()
  @IsString()
  @MaxLength(600)
  description?: string;

  @ApiPropertyOptional({
    enum: CampaignCurrency,
    example: CampaignCurrency.PHP,
  })
  @IsOptional()
  @IsEnum(CampaignCurrency)
  currency?: CampaignCurrency;

  @ApiPropertyOptional({
    example: 12,
    description: 'Tax percentage to apply to subtotal.',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  tax?: number;

  @ApiPropertyOptional({ example: 55000.67 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing?: number;

  @ApiPropertyOptional({ example: ['Instagram', 'Facebook', 'TikTok'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  platforms?: string[];

  @ApiPropertyOptional({ example: '2026-06-07T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2026-06-10T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
