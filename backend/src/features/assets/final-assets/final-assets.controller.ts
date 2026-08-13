import { Controller, Get, Param } from '@nestjs/common';
import { FinalAssetsService } from './final-assets.service';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { ApiFindFinalAssetsForCampaign } from './docs/final-assets.controller.swagger';

@Controller('final-assets')
export class FinalAssetsController {
  constructor(
    private readonly finalAssetsService: FinalAssetsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindFinalAssetsForCampaign()
  @Get('campaign/:campaignPublicId')
  async findFinalAssetsForCampaign(
    @Param('campaignPublicId') campaignPublicId: string,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(campaignPublicId);

    return this.finalAssetsService.findFinalAssetsForCampaign(campaignId);
  }
}
