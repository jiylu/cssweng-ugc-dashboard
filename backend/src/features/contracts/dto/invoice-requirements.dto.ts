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
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @ApiProperty({ example: 'finance@client.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'Summer Glow 2026' })
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  campaign_name!: string;

  @ApiPropertyOptional({ example: 'TIN-123-456-789-000' })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  tax_number?: string;

  @ApiProperty({
    example: 'Bank details: BPI xxx-xxxx; payable within Net 30 terms.',
  })
  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  payment_details!: string;
}
