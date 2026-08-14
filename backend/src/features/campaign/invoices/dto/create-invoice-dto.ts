import { IsNotEmpty, IsString } from 'class-validator';

export class CreateInvoiceDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  invoiceUrl!: string;
}
