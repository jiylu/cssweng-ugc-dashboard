import { OmitType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateAddOnDTO } from 'src/features/campaign/add-ons/dto/create-add-on-dto';
import { CreateCampaignDTO } from 'src/features/campaign/campaigns/dto/create-campaign.dto';
import { CreateContractDTO } from 'src/features/campaign/contracts/dto/create-contract.dto';
import { CreateDeliverableDTO } from 'src/features/deliverable/deliverables/dto/create-deliverable.dto';
import { CreateGiftedProductDTO } from 'src/features/campaign/gifted-products/dto/create-gifted-product.dto';
import { CreateProposalDTO } from 'src/features/campaign/proposals/dto/create-proposal.dto';

class CampaignSetupDto extends OmitType(CreateCampaignDTO, [
  'pricing',
  'paymentSchedule',
] as const) {}
class DeliverableSetupDto extends OmitType(CreateDeliverableDTO, [
  'campaignId',
] as const) {}
class ProposalSetupDto extends OmitType(CreateProposalDTO, [
  'campaignId',
] as const) {}
class ContractSetupDto extends OmitType(CreateContractDTO, [
  'campaignId',
] as const) {}
class AddOnSetupDto extends OmitType(CreateAddOnDTO, ['campaignId'] as const) {}
class GiftedProductSetupDto extends OmitType(CreateGiftedProductDTO, [
  'campaignId',
] as const) {}

export class CreateCampaignRequestDto {
  @ApiProperty({
    type: CampaignSetupDto,
    description:
      "Campaign details (omit 'pricing' — computed from deliverables and gifted products)",
  })
  @ValidateNested()
  @Type(() => CampaignSetupDto)
  campaign!: CampaignSetupDto;

  @ApiProperty({
    type: [DeliverableSetupDto],
    description: "Array of deliverables (omit 'campaignId' for each)",
  })
  @ValidateNested({ each: true })
  @Type(() => DeliverableSetupDto)
  deliverables!: DeliverableSetupDto[];

  @ApiProperty({
    type: ProposalSetupDto,
    description: "Proposal details (omit 'campaignId')",
  })
  @ValidateNested()
  @Type(() => ProposalSetupDto)
  proposal!: ProposalSetupDto;

  @ApiProperty({
    type: ContractSetupDto,
    description:
      "Contract details (omit 'campaignId'). Includes revision policy, usage rights, payment terms, invoice requirements, and other legal terms.",
  })
  @ValidateNested()
  @Type(() => ContractSetupDto)
  contract!: ContractSetupDto;

  @ApiProperty({
    type: [AddOnSetupDto],
    required: false,
    description:
      "Optional add-ons array (omit 'campaignId' for each). Each item includes addOnName, fee, and initials.",
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddOnSetupDto)
  addOns?: AddOnSetupDto[];

  @ApiProperty({
    type: [GiftedProductSetupDto],
    required: false,
    description:
      "Optional gifted products array (omit 'campaignId' for each). Each item includes productName, value, shippingAddress, deliveryInstructions, and ownershipTerms.",
  })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GiftedProductSetupDto)
  giftedProducts?: GiftedProductSetupDto[];
}
