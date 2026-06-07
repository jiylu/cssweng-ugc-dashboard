import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CreateCampaignDTO } from './dto/create-campaign.dto';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  create(@Body() dto: CreateCampaignDTO) {
    return this.campaignsService.createCampaign(dto);
  }

  @Get(':campaignId')
  findOne(@Param('campaignId') campaignId: string) {
    return this.campaignsService.findOneCampaign(campaignId);
  }

  @Get()
  findAll(@Query() query: CampaignQueryDTO) {
    return this.campaignsService.findAllCampaigns(query);
  }

  @Patch(':campaignId/status')
  updateStatus(
    @Param('campaignId') campaignId: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    return this.campaignsService.updateCampaignStatus(campaignId, dto);
  }

  @Patch(':campaignId/client')
  updateClientId(
    @Param('campaignId') campaignId: string,
    @Body() dto: UpdateCampaignClientDTO,
  ) {
    return this.campaignsService.updateCampaignClientId(campaignId, dto);
  }
}
