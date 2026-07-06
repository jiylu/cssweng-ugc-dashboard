import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class InvoiceRequirementsDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  campaign_name!: string;

  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  tax_number?: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  payment_details!: string;
}
