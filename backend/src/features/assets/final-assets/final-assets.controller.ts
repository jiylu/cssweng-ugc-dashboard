import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { FinalAssetsService } from './final-assets.service';
import { CampaignsService } from 'src/features/campaign/campaigns/campaigns.service';
import { FinalAssetsEntity } from './entities/final-assets.entity';
import { ApiFindFinalAssetsForCampaign } from './docs/final-assets.controller.swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('final-assets')
export class FinalAssetsController {
  constructor(
    private readonly finalAssetsService: FinalAssetsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindFinalAssetsForCampaign()
  @Get('campaign/:campaignPublicId')
  @UseGuards(RolesGuard)
  async findFinalAssetsForCampaign(
    @Param('campaignPublicId') campaignPublicId: string,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(campaignPublicId);

    const result =
      await this.finalAssetsService.findFinalAssetsForCampaign(campaignId);

    const transformed: Record<
      string,
      { deliverablePublicId: string; finalAssets: FinalAssetsEntity[] }
    > = {};

    for (const [label, entry] of Object.entries(result)) {
      transformed[label] = {
        deliverablePublicId: entry.deliverablePublicId,
        finalAssets: plainToInstance(FinalAssetsEntity, entry.finalAssets),
      };
    }

    return transformed;
  }
}
