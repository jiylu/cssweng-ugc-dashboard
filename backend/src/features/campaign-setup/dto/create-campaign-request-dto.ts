import { OmitType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { CreateAddOnDTO } from 'src/features/add-ons/dto/create-add-on-dto';
import { CreateCampaignDTO } from 'src/features/campaigns/dto/create-campaign.dto';
import { CreateContractDTO } from 'src/features/contracts/dto/create-contract.dto';
import { CreateDeliverableDTO } from 'src/features/deliverables/dto/create-deliverable.dto';
import { CreateGiftedProductDTO } from 'src/features/gifted-products/dto/create-gifted-product.dto';
import { CreateProposalDTO } from 'src/features/proposals/dto/create-proposal.dto';

class CampaignSetupDto extends OmitType(CreateCampaignDTO, [
  'pricing',
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
      "Campaign details (omit 'pricing' — computed from deliverables)",
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

  @ValidateNested()
  @Type(() => ContractSetupDto)
  contract!: ContractSetupDto;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AddOnSetupDto)
  addOns?: AddOnSetupDto[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => GiftedProductSetupDto)
  giftedProducts?: GiftedProductSetupDto[];
}
