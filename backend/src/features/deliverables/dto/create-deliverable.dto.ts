import { DeliverableType, Format, Platform } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDeliverableDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({ example: 5 })
  @IsNumber()
  @Min(1)
  @Max(10)
  quantity!: number;

  @ApiProperty({
    enum: DeliverableType,
    example: DeliverableType.COLLABORATION,
  })
  @IsEnum(DeliverableType)
  deliverableType!: DeliverableType;

  @ApiProperty({
    enum: Platform,
    example: Platform.FACEBOOK,
  })
  @IsEnum(Platform)
  platform!: Platform;

  @ApiProperty({
    enum: Format,
    example: Format.CAROUSEL,
  })
  @IsEnum(Platform)
  format!: Format;

  @ApiProperty({ example: 'Detailed description with at least 20 characters.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(1000)
  description!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  deadline!: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing!: number;
}
