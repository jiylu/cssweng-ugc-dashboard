import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InvoiceRequirementsDTO {
  @ApiProperty({ example: 'Asceoft Marketing Inc.' })
  @IsString({ message: 'Invoice name must be a string.' })
  @IsNotEmpty({ message: 'Invoice name is required.' })
  @MaxLength(100, { message: 'Invoice name must not exceed 100 characters.' })
  name!: string;

  @ApiProperty({ example: 'finance@client.com' })
  @IsEmail({}, { message: 'Invoice email must be a valid email address.' })
  @IsNotEmpty({ message: 'Invoice email is required.' })
  email!: string;

  @ApiProperty({ example: 'Summer Glow 2026' })
  @IsString({ message: 'Campaign name must be a string.' })
  @MaxLength(150, { message: 'Campaign name must not exceed 150 characters.' })
  @IsNotEmpty({ message: 'Campaign name is required.' })
  campaign_name!: string;

  @ApiPropertyOptional({ example: 'TIN-123-456-789-000' })
  @IsString({ message: 'Tax number must be a string.' })
  @MaxLength(150, { message: 'Tax number must not exceed 150 characters.' })
  @IsOptional()
  tax_number?: string;

  @ApiProperty({
    example: 'Bank details: BPI xxx-xxxx; payable within Net 30 terms.',
  })
  @IsString({ message: 'Payment details must be a string.' })
  @MaxLength(500, { message: 'Payment details must not exceed 500 characters.' })
  @IsNotEmpty({ message: 'Payment details are required.' })
  payment_details!: string;
}
