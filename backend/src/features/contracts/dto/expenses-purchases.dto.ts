import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExpensesPurchasesDTO {
  @Expose()
  @ApiProperty({ example: 30 })
  @IsInt({ message: 'Reimbursement period must be an integer (days).' })
  @Min(1, { message: 'Reimbursement period must be at least 1 day.' })
  reimbursement_period!: number;

  @Expose()
  @ApiProperty({
    example:
      'Approved purchases are reimbursed with valid receipt submission within the period.',
  })
  @IsString({ message: 'Gifted product terms must be a string.' })
  @IsNotEmpty({ message: 'Gifted product terms are required.' })
  @MaxLength(500, {
    message: 'Gifted product terms must not exceed 500 characters.',
  })
  gifted_product_terms!: string;
}
