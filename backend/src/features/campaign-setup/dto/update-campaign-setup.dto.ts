import { ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { CreateAddOnDTO } from 'src/features/add-ons/dto/create-add-on-dto';
import { UpdateAddOnDTO } from 'src/features/add-ons/dto/update-add-on.dto';
import { UpdateCampaignDetailsDTO } from 'src/features/campaigns/dto/update-campaign-details.dto';
import { UpdateContractDTO } from 'src/features/contracts/dto/update-contract.dto';
import { CreateDeliverableDTO } from 'src/features/deliverables/dto/create-deliverable.dto';
import { UpdateDeliverableDTO } from 'src/features/deliverables/dto/update-deliverable.dto';
import { CreateGiftedProductDTO } from 'src/features/gifted-products/dto/create-gifted-product.dto';
import { UpdateGiftedProductDTO } from 'src/features/gifted-products/dto/update-gifted-product.dto';

class CreateDeliverableSetupDto extends OmitType(CreateDeliverableDTO, [
  'campaignId',
] as const) {}

class UpdateDeliverableSetupDto extends UpdateDeliverableDTO {
  @IsString()
  deliverableId!: string;
}

class CreateGiftedProductSetupDto extends OmitType(CreateGiftedProductDTO, [
  'campaignId',
] as const) {}

class UpdateGiftedProductSetupDto extends UpdateGiftedProductDTO {
  @IsString()
  giftedProductId!: string;
}

class CreateAddOnSetupDto extends OmitType(CreateAddOnDTO, [
  'campaignId',
] as const) {}

class UpdateAddOnSetupDto extends UpdateAddOnDTO {
  @IsString()
  addOnId!: string;
}

class UpdateContractSetupDto extends UpdateContractDTO {
  @IsString()
  contractId!: string;
}

class DeliverablesMutationDto {
  @ApiPropertyOptional({ type: [CreateDeliverableSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDeliverableSetupDto)
  create?: CreateDeliverableSetupDto[];

  @ApiPropertyOptional({ type: [UpdateDeliverableSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateDeliverableSetupDto)
  update?: UpdateDeliverableSetupDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  delete?: string[];
}

class GiftedProductsMutationDto {
  @ApiPropertyOptional({ type: [CreateGiftedProductSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateGiftedProductSetupDto)
  create?: CreateGiftedProductSetupDto[];

  @ApiPropertyOptional({ type: [UpdateGiftedProductSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateGiftedProductSetupDto)
  update?: UpdateGiftedProductSetupDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  delete?: string[];
}

class AddOnsMutationDto {
  @ApiPropertyOptional({ type: [CreateAddOnSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddOnSetupDto)
  create?: CreateAddOnSetupDto[];

  @ApiPropertyOptional({ type: [UpdateAddOnSetupDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateAddOnSetupDto)
  update?: UpdateAddOnSetupDto[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  delete?: string[];
}

export class UpdateCampaignSetupDto {
  @ApiPropertyOptional({ type: UpdateCampaignDetailsDTO })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCampaignDetailsDTO)
  campaign?: UpdateCampaignDetailsDTO;

  @ApiPropertyOptional({ type: UpdateContractSetupDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateContractSetupDto)
  contract?: UpdateContractSetupDto;

  @ApiPropertyOptional({ type: DeliverablesMutationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => DeliverablesMutationDto)
  deliverables?: DeliverablesMutationDto;

  @ApiPropertyOptional({ type: GiftedProductsMutationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => GiftedProductsMutationDto)
  giftedProducts?: GiftedProductsMutationDto;

  @ApiPropertyOptional({ type: AddOnsMutationDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddOnsMutationDto)
  addOns?: AddOnsMutationDto;
}
