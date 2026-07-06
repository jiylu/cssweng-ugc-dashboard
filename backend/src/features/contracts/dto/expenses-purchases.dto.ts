import { IsInt, IsNotEmpty, IsString, Max, Min } from 'class-validator';

export class ExpensesPurchasesDTO {
  @IsInt()
  @Min(1)
  reimbursement_period!: number;

  @IsString()
  @IsNotEmpty()
  @Max(500)
  gifted_product_terms!: string;
}
