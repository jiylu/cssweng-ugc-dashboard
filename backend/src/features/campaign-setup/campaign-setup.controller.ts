import { Body, Controller, Post } from '@nestjs/common';
import { CampaignSetupService } from './campaign-setup.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { ApiCreateFullCampaign } from './docs/campaign-setup.controller.swagger';

@Controller('campaign-setup')
export class CampaignSetupController {
  constructor(private readonly campaignSetupService: CampaignSetupService) {}

  @ApiCreateFullCampaign()
  @Post()
  async create(@Body() dto: CreateCampaignRequestDto) {
    return await this.campaignSetupService.createFullCampaignService(dto);
  }
}
