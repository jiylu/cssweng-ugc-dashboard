import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class UpdatePaidAmountDTO {
  @IsNumber()
  @Type(() => Number)
  paidAmount!: number;
}
