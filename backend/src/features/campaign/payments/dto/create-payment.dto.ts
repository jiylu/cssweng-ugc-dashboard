import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePaymentDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  proofPaymentUrl!: string;
}
