import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { RevisionPolicyDTO } from './revision-policy.dto';
import { UsageRightsDTO } from './usage-rights.dto';
import { PostingRequirementsDTO } from './posting-requirements.dto';
import { ExclusivityDTO } from './exclusivity.dto';
import { ExpensesPurchasesDTO } from './expenses-purchases.dto';
import { PaymentTermsDTO } from './payment-terms.dto';
import { InvoiceRequirementsDTO } from './invoice-requirements.dto';
import { GeneralTermsDTO } from './general-terms.dto';

export class CreateContractDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({ type: RevisionPolicyDTO })
  @ValidateNested()
  @Type(() => RevisionPolicyDTO)
  revision_policy!: RevisionPolicyDTO;

  @ApiProperty({ type: UsageRightsDTO })
  @ValidateNested()
  @Type(() => UsageRightsDTO)
  usage_rights!: UsageRightsDTO;

  @ApiProperty({ type: PostingRequirementsDTO })
  @ValidateNested()
  @Type(() => PostingRequirementsDTO)
  posting_requirements!: PostingRequirementsDTO;

  @ApiPropertyOptional({ type: ExclusivityDTO })
  @ValidateNested()
  @Type(() => ExclusivityDTO)
  exclusivity?: ExclusivityDTO;

  @ApiPropertyOptional({ type: ExpensesPurchasesDTO })
  @ValidateNested()
  @Type(() => ExpensesPurchasesDTO)
  expenses_purchases_terms?: ExpensesPurchasesDTO;

  @ApiProperty({ example: 7 })
  @IsInt()
  @Min(1)
  @Max(365)
  cancellation_period!: number;

  @ApiProperty({ type: PaymentTermsDTO })
  @ValidateNested()
  @Type(() => PaymentTermsDTO)
  payment_terms!: PaymentTermsDTO;

  @ApiProperty({ type: InvoiceRequirementsDTO })
  @ValidateNested()
  @Type(() => InvoiceRequirementsDTO)
  invoice_requirements!: InvoiceRequirementsDTO;

  @ApiProperty({ type: GeneralTermsDTO })
  @ValidateNested()
  @Type(() => GeneralTermsDTO)
  general_terms!: GeneralTermsDTO;

  @ApiPropertyOptional({
    example:
      'Any additional legal and operational notes agreed by both parties.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  extra_notes?: string;
}
