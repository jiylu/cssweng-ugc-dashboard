import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGiftedProductDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  productName!: string;

  @IsNumber()
  @Type(() => Number)
  @Min(0)
  value!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  deliveryDetails!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  ownershipTerms!: string;
}
