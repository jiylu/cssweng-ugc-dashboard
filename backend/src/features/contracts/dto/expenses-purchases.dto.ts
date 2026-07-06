import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class ExpensesPurchasesDTO {
  @IsInt()
  @Min(1)
  reimbursement_period!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  gifted_product_terms!: string;
}
