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
  @IsNumber({}, { message: 'Quantity must be a number.' })
  @Type(() => Number)
  @Min(1, { message: 'Quantity must be at least 1.' })
  @Max(10, { message: 'Quantity must not exceed 10.' })
  quantity?: number;

  @ApiPropertyOptional({
    enum: DeliverableType,
    example: DeliverableType.COLLABORATION,
  })
  @IsOptional()
  @IsEnum(DeliverableType, {
    message: 'Deliverable type must be a valid deliverable type.',
  })
  deliverableType?: DeliverableType;

  @ApiPropertyOptional({ example: 'Instagram Carousel' })
  @IsOptional()
  @IsString({ message: 'Deliverable content must be a string.' })
  @MaxLength(250, {
    message: 'Deliverable content must not exceed 250 characters.',
  })
  deliverableContent?: string;

  @ApiPropertyOptional({
    example: '50 sec reel, with captions, highlighting product.',
  })
  @IsOptional()
  @IsString({ message: 'Requirements must be a string.' })
  @MinLength(50, { message: 'Requirements must be at least 50 characters.' })
  @MaxLength(1000, { message: 'Requirements must not exceed 1000 characters.' })
  requirements?: string;

  @ApiPropertyOptional({ example: '2026-06-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Due date must be a valid ISO 8601 date string.' },
  )
  dueDate?: string;

  @ApiPropertyOptional({ example: '2026-06-15T00:00:00.000Z' })
  @IsOptional()
  @IsDateString(
    {},
    { message: 'Post date must be a valid ISO 8601 date string.' },
  )
  postDate?: string;

  @ApiPropertyOptional({ example: 1500 })
  @IsOptional()
  @IsNumber({}, { message: 'Pricing must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Pricing must not be negative.' })
  pricing?: number;
}
