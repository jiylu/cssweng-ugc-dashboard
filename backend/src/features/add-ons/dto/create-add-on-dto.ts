import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateAddOnDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  addOnName!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  fee!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  initials!: string;
}
