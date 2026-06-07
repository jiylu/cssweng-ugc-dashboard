import { ApiProperty } from '@nestjs/swagger';
import { CampaignStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class UpdateCampaignStatusDto {
  @ApiProperty({ example: 'COMPLETED' })
  @IsString()
  @IsNotEmpty()
  @IsEnum(CampaignStatus)
  campaignStatus!: CampaignStatus;
}
