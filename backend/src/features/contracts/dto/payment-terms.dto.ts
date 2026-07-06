import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum PAYMENT_SCHEDULE {
  'NET_15',
  'NET_30',
  '50_DEPOSIT_50_FINAL',
  'DUE_FINAL_DELIVERY',
}

export class PaymentTermsDTO {
  @IsEnum(PAYMENT_SCHEDULE)
  payment_schedule!: PAYMENT_SCHEDULE;

  @IsString()
  @IsNotEmpty()
  payment_method!: string;
}
