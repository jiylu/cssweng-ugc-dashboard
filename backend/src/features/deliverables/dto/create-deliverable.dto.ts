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

  @ApiProperty({ example: 'Instagram Carousel' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  deliverableContent!: string;

  @ApiProperty({ example: '50 sec reel, with captions, highlighting product.' })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(1000)
  requirements!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  dueDate!: string;

  @ApiProperty({ example: '2026-06-15T00:00:00.000Z' })
  @IsDateString()
  @IsNotEmpty()
  postDate!: string;

  @ApiProperty({ example: 1500 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing!: number;
}
