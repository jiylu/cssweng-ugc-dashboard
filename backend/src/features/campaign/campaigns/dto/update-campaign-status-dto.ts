import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCampaignStatusDto {
  @ApiProperty({ enum: CampaignStatus, example: CampaignStatus.COMPLETED })
  @IsNotEmpty({ message: 'Campaign status is required.' })
  @IsEnum(CampaignStatus, {
    message: 'Campaign status must be a valid campaign status.',
  })
  campaignStatus!: CampaignStatus;
}
