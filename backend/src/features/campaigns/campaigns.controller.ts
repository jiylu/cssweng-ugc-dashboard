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
import { plainToInstance } from 'class-transformer';
import { CampaignsEntity } from './entities/campaigns.entity';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiFindOneCampaign()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const campaign = await this.campaignsService.findOneCampaign(campaignId);

    return plainToInstance(CampaignsEntity, campaign);
  }

  @ApiFindAllCampaigns()
  @Get()
  async findAll(@Query() query: CampaignQueryDTO) {
    const campaigns = await this.campaignsService.findAllCampaigns(query);
    return plainToInstance(CampaignsEntity, campaigns);
  }

  @ApiUpdateCampaignStatus()
  @Patch('status/:publicId')
  async updateStatus(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCampaignStatusDto,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);

    const updatedCampaign = await this.campaignsService.updateCampaignStatus(
      campaignId,
      dto,
    );

    return plainToInstance(CampaignsEntity, updatedCampaign);
  }

  @ApiUpdateCampaignClient()
  @Patch('client/:publicId')
  async updateClientId(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCampaignClientDTO,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);

    const updatedCampaign = await this.campaignsService.updateCampaignClientId(
      campaignId,
      dto,
    );

    return plainToInstance(CampaignsEntity, updatedCampaign);
  }
}
