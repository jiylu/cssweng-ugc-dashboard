import {
  ApiProperty,
  ApiPropertyOptional,
  OmitType,
  PartialType,
} from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateAddOnDTO } from 'src/features/add-ons/dto/create-add-on-dto';
import { CreateCampaignDTO } from 'src/features/campaigns/dto/create-campaign.dto';
import { ExclusivityDTO } from 'src/features/contracts/dto/exclusivity.dto';
import { ExpensesPurchasesDTO } from 'src/features/contracts/dto/expenses-purchases.dto';
import { GeneralTermsDTO } from 'src/features/contracts/dto/general-terms.dto';
import { InvoiceRequirementsDTO } from 'src/features/contracts/dto/invoice-requirements.dto';
import { PaymentTermsDTO } from 'src/features/contracts/dto/payment-terms.dto';
import { PostingRequirementsDTO } from 'src/features/contracts/dto/posting-requirements.dto';
import { RevisionPolicyDTO } from 'src/features/contracts/dto/revision-policy.dto';
import { UsageRightsDTO } from 'src/features/contracts/dto/usage-rights.dto';
import { CreateDeliverableDTO } from 'src/features/deliverables/dto/create-deliverable.dto';
import { CreateGiftedProductDTO } from 'src/features/gifted-products/dto/create-gifted-product.dto';
import { CreateProposalDTO } from 'src/features/proposals/dto/create-proposal.dto';

type DraftJsonValue = Prisma.InputJsonValue | null | undefined;
class DraftCampaignDto extends PartialType(
  OmitType(CreateCampaignDTO, ['pricing'] as const),
) {
  [key: string]: DraftJsonValue;
}

class DraftDeliverableDto extends PartialType(
  OmitType(CreateDeliverableDTO, ['campaignId'] as const),
) {
  [key: string]: DraftJsonValue;
}

class DraftProposalDto extends PartialType(
  OmitType(CreateProposalDTO, ['campaignId'] as const),
) {
  [key: string]: DraftJsonValue;
}

class DraftAddOnDto extends PartialType(
  OmitType(CreateAddOnDTO, ['campaignId'] as const),
) {
  [key: string]: DraftJsonValue;
}

class DraftGiftedProductDto extends PartialType(
  OmitType(CreateGiftedProductDTO, ['campaignId'] as const),
) {
  [key: string]: DraftJsonValue;
}

class DraftRevisionPolicyDto extends PartialType(RevisionPolicyDTO) {
  [key: string]: DraftJsonValue;
}
class DraftUsageRightsDto extends PartialType(UsageRightsDTO) {
  [key: string]: DraftJsonValue;
}
class DraftPostingRequirementsDto extends PartialType(PostingRequirementsDTO) {
  [key: string]: DraftJsonValue;
}
class DraftExclusivityDto extends PartialType(ExclusivityDTO) {
  [key: string]: DraftJsonValue;
}
class DraftExpensesPurchasesDto extends PartialType(ExpensesPurchasesDTO) {
  [key: string]: DraftJsonValue;
}
class DraftPaymentTermsDto extends PartialType(PaymentTermsDTO) {
  [key: string]: DraftJsonValue;
}
class DraftInvoiceRequirementsDto extends PartialType(InvoiceRequirementsDTO) {
  [key: string]: DraftJsonValue;
}
class DraftGeneralTermsDto extends PartialType(GeneralTermsDTO) {
  [key: string]: DraftJsonValue;
}

class DraftContractDto {
  [key: string]: DraftJsonValue;
  @ApiPropertyOptional({ type: DraftRevisionPolicyDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftRevisionPolicyDto)
  revision_policy?: DraftRevisionPolicyDto;

  @ApiPropertyOptional({ type: DraftUsageRightsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftUsageRightsDto)
  usage_rights?: DraftUsageRightsDto;

  @ApiPropertyOptional({ type: DraftPostingRequirementsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftPostingRequirementsDto)
  posting_requirements?: DraftPostingRequirementsDto;

  @ApiPropertyOptional({ type: DraftExclusivityDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftExclusivityDto)
  exclusivity?: DraftExclusivityDto;

  @ApiPropertyOptional({ type: DraftExpensesPurchasesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftExpensesPurchasesDto)
  expenses_purchases_terms?: DraftExpensesPurchasesDto;

  @ApiPropertyOptional({ example: 7 })
  @IsOptional()
  @IsInt()
  @Min(0)
  cancellation_period?: number;

  @ApiPropertyOptional({ type: DraftPaymentTermsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftPaymentTermsDto)
  payment_terms?: DraftPaymentTermsDto;

  @ApiPropertyOptional({ type: DraftInvoiceRequirementsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftInvoiceRequirementsDto)
  invoice_requirements?: DraftInvoiceRequirementsDto;

  @ApiPropertyOptional({ type: DraftGeneralTermsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftGeneralTermsDto)
  general_terms?: DraftGeneralTermsDto;

  @ApiPropertyOptional({
    example:
      'Any additional legal and operational notes agreed by both parties.',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  extra_notes?: string;
}

export class CreateDraftDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'User ID must be a string.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId!: string;

  @ApiPropertyOptional({
    type: DraftCampaignDto,
    description: "Draft campaign details (omit 'pricing').",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftCampaignDto)
  campaign?: DraftCampaignDto;

  @ApiPropertyOptional({
    type: DraftProposalDto,
    description: "Draft proposal details (omit 'campaignId').",
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftProposalDto)
  proposal?: DraftProposalDto;

  @ApiPropertyOptional({
    type: [DraftDeliverableDto],
    description: "Draft deliverables array (omit 'campaignId' for each).",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftDeliverableDto)
  deliverables?: DraftDeliverableDto[];

  @ApiPropertyOptional({
    type: DraftContractDto,
    description:
      'Draft contract details with nested JSON sections matching campaign setup.',
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => DraftContractDto)
  contract?: DraftContractDto;

  @ApiPropertyOptional({
    type: [DraftAddOnDto],
    description: "Draft add-ons array (omit 'campaignId' for each).",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftAddOnDto)
  addOns?: DraftAddOnDto[];

  @ApiPropertyOptional({
    type: [DraftGiftedProductDto],
    description: "Draft gifted products array (omit 'campaignId' for each).",
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DraftGiftedProductDto)
  giftedProducts?: DraftGiftedProductDto[];
}
