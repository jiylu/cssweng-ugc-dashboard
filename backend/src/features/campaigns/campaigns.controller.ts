import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';
import {
  ApiFindAllCampaigns,
  ApiFindOneCampaign,
  ApiUpdateCampaignClient,
  ApiUpdateCampaignStatus,
} from './docs/campaigns.controller.swagger';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiFindOneCampaign()
  @Get(':campaignId')
  findOne(@Param('campaignId') campaignId: string) {
    return this.campaignsService.findOneCampaign(campaignId);
  }

  @ApiFindAllCampaigns()
  @Get()
  findAll(@Query() query: CampaignQueryDTO) {
    return this.campaignsService.findAllCampaigns(query);
  }

  @ApiUpdateCampaignStatus()
  @Patch(':campaignId/status')
  updateStatus(
    @Param('campaignId') campaignId: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignsService.updateCampaignStatus(campaignId, dto);
  }

  @ApiUpdateCampaignClient()
  @Patch(':campaignId/client')
  updateClientId(
    @Param('campaignId') campaignId: string,
    @Body() dto: UpdateCampaignClientDTO,
  ) {
    return this.campaignsService.updateCampaignClientId(campaignId, dto);
  }
}
