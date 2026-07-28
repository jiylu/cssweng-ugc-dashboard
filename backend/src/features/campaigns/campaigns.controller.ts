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
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    return this.campaignsService.findOneCampaign(campaignId);
  }

  @ApiFindAllCampaigns()
  @Get()
  findAll(@Query() query: CampaignQueryDTO) {
    return this.campaignsService.findAllCampaigns(query);
  }

  @ApiUpdateCampaignStatus()
  @Patch('status/:publicId')
  async updateStatus(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    return this.campaignsService.updateCampaignStatus(campaignId, dto);
  }

  @ApiUpdateCampaignClient()
  @Patch('client/:publicId')
  async updateClientId(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCampaignClientDTO,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    return this.campaignsService.updateCampaignClientId(campaignId, dto);
  }
}
