import { OmitType, ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';
import { CreateCampaignDTO } from 'src/features/campaigns/dto/create-campaign.dto';
import { CreateDeliverableDTO } from 'src/features/deliverables/dto/create-deliverable.dto';
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
}
