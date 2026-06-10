import { DeliverableType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeliverableDTO {
  @ApiPropertyOptional({ example: 'Updated title', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  deliverableTitle?: string;

  @ApiPropertyOptional({
    example: 'Updated description with sufficient length',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description?: string;

  @ApiPropertyOptional({ example: '2026-07-01T00:00:00.000Z', required: false })
  @IsOptional()
  @IsDateString()
  deadline?: string;

  @ApiPropertyOptional({ example: 999, required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing?: number;

  @ApiPropertyOptional({
    enum: DeliverableType,
    example: DeliverableType.UGC,
    required: false,
  })
  @IsOptional()
  @IsEnum(DeliverableType)
  deliverableType?: DeliverableType;
}
