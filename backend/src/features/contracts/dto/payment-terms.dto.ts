import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PAYMENT_SCHEDULE {
  NET_15 = 'NET_15',
  NET_30 = 'NET_30',
  DEPOSIT_50_FINAL_50 = '50_DEPOSIT_50_FINAL',
  DUE_FINAL_DELIVERY = 'DUE_FINAL_DELIVERY',
}

export class PaymentTermsDTO {
  @ApiProperty({
    enum: PAYMENT_SCHEDULE,
    example: PAYMENT_SCHEDULE.NET_30,
  })
  @IsEnum(PAYMENT_SCHEDULE, { message: 'Payment schedule must be a valid payment schedule.' })
  payment_schedule!: PAYMENT_SCHEDULE;

  @ApiProperty({ example: 'Bank Transfer' })
  @IsString({ message: 'Payment method must be a string.' })
  @IsNotEmpty({ message: 'Payment method is required.' })
  payment_method!: string;
}
