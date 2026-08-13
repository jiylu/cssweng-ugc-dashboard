import { Controller, Get, Param } from '@nestjs/common';
import { FinalAssetsService } from './final-assets.service';
import { ApiFindFinalAssetsForCampaign } from './docs/final-assets.controller.swagger';

@Controller('final-assets')
export class FinalAssetsController {
  constructor(private readonly finalAssetsService: FinalAssetsService) {}

  @ApiFindFinalAssetsForCampaign()
  @Get('campaign/:campaignId')
  async findFinalAssetsForCampaign(@Param('campaignId') campaignId: string) {
    return this.finalAssetsService.findFinalAssetsForCampaign(campaignId);
  }
}
