import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ShippingAddressDTO } from './shipping-address.dto';

export class CreateGiftedProductDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'Campaign ID must be a string.' })
  @IsNotEmpty({ message: 'Campaign ID is required.' })
  campaignId!: string;

  @ApiProperty({ example: 'Hydrating Night Cream' })
  @IsString({ message: 'Product name must be a string.' })
  @IsNotEmpty({ message: 'Product name is required.' })
  @MaxLength(100, { message: 'Product name must not exceed 100 characters.' })
  productName!: string;

  @ApiProperty({ example: 1800 })
  @IsNumber({}, { message: 'Value must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Value must not be negative.' })
  value!: number;

  @ApiProperty({ type: ShippingAddressDTO })
  @ValidateNested()
  @Type(() => ShippingAddressDTO)
  shippingAddress!: ShippingAddressDTO;

  @ApiProperty({
    example: 'Deliver weekdays 9AM-5PM, call recipient before arrival.',
  })
  @IsString({ message: 'Delivery instructions must be a string.' })
  @IsNotEmpty({ message: 'Delivery instructions are required.' })
  @MaxLength(200, {
    message: 'Delivery instructions must not exceed 200 characters.',
  })
  deliveryInstructions!: string;

  @ApiProperty({
    example: 'Recipient retains ownership unless campaign is canceled.',
  })
  @IsString({ message: 'Ownership terms must be a string.' })
  @IsNotEmpty({ message: 'Ownership terms are required.' })
  @MaxLength(500, {
    message: 'Ownership terms must not exceed 500 characters.',
  })
  ownershipTerms!: string;
}
