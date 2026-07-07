import { DeliverableType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeliverableDTO {
  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  quantity?: number;

  @ApiPropertyOptional({
    enum: DeliverableType,
    example: DeliverableType.COLLABORATION,
  })
  @IsOptional()
  @IsEnum(DeliverableType)
  deliverableType?: DeliverableType;

  @ApiPropertyOptional({ example: 'Instagram Carousel' })
  @IsOptional()
  @IsString()
  @MaxLength(250)
  deliverableContent?: string;

  @ApiPropertyOptional({
    example: '50 sec reel, with captions, highlighting product.',
  })
  @IsOptional()
  @IsString()
  @MinLength(50)
  @MaxLength(1000)
  requirements?: string;

  @ApiPropertyOptional({ example: '2026-06-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional({ example: '2026-06-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString()
  postDate?: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing?: number;
}
