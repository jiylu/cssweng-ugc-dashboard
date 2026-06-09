import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateCampaignStatusDto {
  @ApiProperty({ example: 'COMPLETED' })
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  campaignStatus!: CampaignStatus;
}
