import { Body, Controller, Post } from '@nestjs/common';
import { CampaignSetupService } from './campaign-setup.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';

@Controller('campaign-setup')
export class CampaignSetupController {
  constructor(private readonly campaignSetupService: CampaignSetupService) {}

  @Post()
  async create(@Body() dto: CreateCampaignRequestDto) {
    return await this.campaignSetupService.createFullCampaignService(dto);
  }
}
