import { ApiProperty } from '@nestjs/swagger';
import { CampaignType } from '@prisma/client';
import {
  IsDateString,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateCampaignDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  ugcId!: string;

  @ApiProperty({ example: 'New Project' })
  @IsString()
  @MaxLength(50)
  projectName!: string;

  @ApiProperty({ example: 'This is my new project.' })
  @IsString()
  @MaxLength(600)
  description!: string;

  @ApiProperty({ example: '55000.67' })
  @IsDecimal()
  pricing!: number;

  @ApiProperty({ example: '2026-06-07T00:00:00.000Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2026-06-10T00:00:00.000Z' })
  @IsDateString()
  endDate!: string;

  @ApiProperty({ example: 'UGC' })
  @IsEnum(CampaignType)
  campaignType!: CampaignType;
}
