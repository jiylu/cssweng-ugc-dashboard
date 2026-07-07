import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExpensesPurchasesDTO {
  @ApiProperty({ example: 30 })
  @IsInt()
  @Min(1)
  reimbursement_period!: number;

  @ApiProperty({
    example:
      'Approved purchases are reimbursed with valid receipt submission within the period.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  gifted_product_terms!: string;
}
