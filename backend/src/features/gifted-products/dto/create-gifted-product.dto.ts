import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateGiftedProductDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({ example: 'Hydrating Night Cream' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  productName!: string;

  @ApiProperty({ example: 1800 })
  @IsNumber()
  @Type(() => Number)
  @Min(0)
  value!: number;

  @ApiProperty({ example: '123 Sample St, Makati City, Metro Manila' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  deliveryAddress!: string;

  @ApiProperty({
    example: 'Deliver weekdays 9AM-5PM, call recipient before arrival.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  deliveryInstructions!: string;

  @ApiProperty({
    example: 'Recipient retains ownership unless campaign is canceled.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  ownershipTerms!: string;
}
