import { DeliverableType } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateDeliverableDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  deliverableTitle!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(1000)
  description!: string;

  @IsDateString()
  @IsNotEmpty()
  deadline!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing!: number;

  @IsEnum(DeliverableType)
  deliverableType!: DeliverableType;
}
