import { Type } from 'class-transformer';
import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ExclusivityDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  category!: string;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  territory!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  brandlist!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  exclusivity_fee!: number;
}
