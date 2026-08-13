import { ApiProperty } from '@nestjs/swagger';
import { CampaignCurrency, PaymentSchedule } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCampaignDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'UGC creator ID must be a string.' })
  @IsNotEmpty({ message: 'UGC creator ID is required.' })
  ugcId!: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000', required: false })
  @IsOptional()
  @IsString({ message: 'Client ID must be a string.' })
  clientId?: string;

  @ApiProperty({ example: 'New Project' })
  @IsString({ message: 'Project name must be a string.' })
  @MaxLength(150, { message: 'Project name must not exceed 150 characters.' })
  projectName!: string;

  @ApiProperty({ example: 'This is my new project.' })
  @IsString({ message: 'Description must be a string.' })
  @MaxLength(600, { message: 'Description must not exceed 600 characters.' })
  description!: string;

  @ApiProperty({
    enum: CampaignCurrency,
    example: CampaignCurrency.PHP,
  })
  @IsEnum(CampaignCurrency, {
    message: 'Currency must be a valid campaign currency (PHP, USD, etc.).',
  })
  currency!: CampaignCurrency;

  @ApiProperty({
    example: 12,
    description: 'Tax percentage to apply to subtotal.',
  })
  @IsNumber({}, { message: 'Tax must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Tax must not be negative.' })
  tax!: number;

  @ApiProperty({ example: '55000.67' })
  @IsNumber({}, { message: 'Pricing must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Pricing must not be negative.' })
  pricing!: number;

  @IsObject()
  platforms!: Record<string, string>;

  @ApiProperty({ example: '2026-06-07T00:00:00.000Z' })
  @IsDateString(
    {},
    { message: 'Start date must be a valid ISO 8601 date string.' },
  )
  startDate!: string;

  @ApiProperty({ example: '2026-06-10T00:00:00.000Z' })
  @IsDateString(
    {},
    { message: 'End date must be a valid ISO 8601 date string.' },
  )
  endDate!: string;

  @IsEnum(PaymentSchedule)
  paymentSchedule!: PaymentSchedule;
}
