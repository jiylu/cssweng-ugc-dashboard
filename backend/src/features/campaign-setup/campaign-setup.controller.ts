import { Body, Controller, Post } from '@nestjs/common';
import { CampaignSetupService } from './campaign-setup.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { ApiCreateFullCampaign } from './docs/campaign-setup.controller.swagger';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Action, EntityType } from '@prisma/client';

@Controller('campaign-setup')
export class CampaignSetupController {
  constructor(
    private readonly campaignSetupService: CampaignSetupService,
    private readonly activityLogService: ActivityLogService,
  ) {}

  @ApiCreateFullCampaign()
  @Post()
  async create(@Body() dto: CreateCampaignRequestDto) {
    const result =
      await this.campaignSetupService.createFullCampaignService(dto);

    if (!result) {
      return null;
    }

    await this.activityLogService.createActivityLog({
      userId: dto.campaign.ugcId,
      entityType: EntityType.CAMPAIGN,
      entityId: result.campaign.campaign_id,
      action: Action.SUBMISSION,
    });

    return result;
  }
}
