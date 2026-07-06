import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
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
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ValidateNested()
  @Type(() => RevisionPolicyDTO)
  revision_policy!: RevisionPolicyDTO;

  @ValidateNested()
  @Type(() => UsageRightsDTO)
  usage_rights!: UsageRightsDTO;

  @ValidateNested()
  @Type(() => PostingRequirementsDTO)
  posting_requirements!: PostingRequirementsDTO;

  @ValidateNested()
  @Type(() => ExclusivityDTO)
  exclusivity?: ExclusivityDTO;

  @ValidateNested()
  @Type(() => ExpensesPurchasesDTO)
  expenses_purchases_terms?: ExpensesPurchasesDTO;

  @IsInt()
  @Min(0)
  cancellation_period!: number;

  @ValidateNested()
  @Type(() => PaymentTermsDTO)
  payment_terms!: PaymentTermsDTO;

  @ValidateNested()
  @Type(() => InvoiceRequirementsDTO)
  invoice_requirements!: InvoiceRequirementsDTO;

  @ValidateNested()
  @Type(() => GeneralTermsDTO)
  general_terms!: GeneralTermsDTO;

  @IsString()
  @IsOptional()
  @MaxLength(500)
  extra_notes?: string;
}
