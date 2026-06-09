import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCampaignStatusDto {
  @ApiProperty({ enum: CampaignStatus, example: CampaignStatus.COMPLETED })
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  campaignStatus!: CampaignStatus;
}
