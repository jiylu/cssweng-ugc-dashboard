import { DeliverableType } from '@prisma/client';
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
  @IsString({ message: 'Campaign ID must be a string.' })
  @IsNotEmpty({ message: 'Campaign ID is required.' })
  campaignId!: string;

  @ApiProperty({ example: 5 })
  @IsNumber({}, { message: 'Quantity must be a number.' })
  @Min(1, { message: 'Quantity must be at least 1.' })
  @Max(10, { message: 'Quantity must not exceed 10.' })
  quantity!: number;

  @ApiProperty({
    enum: DeliverableType,
    example: DeliverableType.COLLABORATION,
  })
  @IsEnum(DeliverableType, { message: 'Deliverable type must be a valid deliverable type.' })
  deliverableType!: DeliverableType;

  @ApiProperty({ example: 'Instagram Carousel' })
  @IsString({ message: 'Deliverable content must be a string.' })
  @IsNotEmpty({ message: 'Deliverable content is required.' })
  @MaxLength(250, { message: 'Deliverable content must not exceed 250 characters.' })
  deliverableContent!: string;

  @ApiProperty({ example: '50 sec reel, with captions, highlighting product.' })
  @IsString({ message: 'Requirements must be a string.' })
  @IsNotEmpty({ message: 'Requirements are required.' })
  @MinLength(50, { message: 'Requirements must be at least 50 characters.' })
  @MaxLength(1000, { message: 'Requirements must not exceed 1000 characters.' })
  requirements!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString({}, { message: 'Due date must be a valid ISO 8601 date string.' })
  @IsNotEmpty({ message: 'Due date is required.' })
  dueDate!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString({}, { message: 'Post date must be a valid ISO 8601 date string.' })
  @IsNotEmpty({ message: 'Post date is required.' })
  postDate!: string;

  @ApiProperty({ example: 1500 })
  @IsNumber({}, { message: 'Pricing must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Pricing must not be negative.' })
  pricing!: number;
}
