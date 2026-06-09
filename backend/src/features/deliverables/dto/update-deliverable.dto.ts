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

export class UpdateDeliverableDTO {
  @IsOptional()
  @IsString()
  @MaxLength(150)
  deliverableTitle?: string;

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description?: string;

  @IsOptional()
  @IsDateString()
  deadline?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  pricing?: number;

  @IsOptional()
  @IsEnum(DeliverableType)
  deliverableType?: DeliverableType;
}
