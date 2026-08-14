import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class ShippingAddressDTO {
  @Expose()
  @ApiProperty({ example: '123 Sample St' })
  @IsString({ message: 'Delivery address line 1 must be a string.' })
  @IsNotEmpty({ message: 'Delivery address line 1 is required.' })
  @MaxLength(200, {
    message: 'Delivery address line 1 must not exceed 200 characters.',
  })
  delivery_address_line_1!: string;

  @Expose()
  @ApiProperty({ example: 'Building 2, Unit 4' })
  @IsString({ message: 'Delivery address line 2 must be a string.' })
  @IsOptional()
  @MaxLength(200, {
    message: 'Delivery address line 2 must not exceed 200 characters.',
  })
  delivery_address_line_2?: string;

  @Expose()
  @ApiProperty({ example: 'Philippines' })
  @IsString({ message: 'Country must be a string.' })
  @IsNotEmpty({ message: 'Country is required.' })
  @MaxLength(100, { message: 'Country must not exceed 100 characters.' })
  country!: string;

  @Expose()
  @ApiProperty({ example: 'Metro Manila' })
  @IsString({ message: 'State/province must be a string.' })
  @IsNotEmpty({ message: 'State/province is required.' })
  @MaxLength(100, {
    message: 'State/province must not exceed 100 characters.',
  })
  state_province!: string;

  @Expose()
  @ApiProperty({ example: 'Makati City' })
  @IsString({ message: 'City must be a string.' })
  @IsNotEmpty({ message: 'City is required.' })
  @MaxLength(100, { message: 'City must not exceed 100 characters.' })
  city!: string;

  @Expose()
  @ApiProperty({ example: 1226 })
  @IsNumber({}, { message: 'Zip code must be a number.' })
  @Type(() => Number)
  @Min(0, { message: 'Zip code must not be negative.' })
  zip_code!: number;
}
