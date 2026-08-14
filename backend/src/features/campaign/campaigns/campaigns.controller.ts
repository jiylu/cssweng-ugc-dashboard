import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';
import {
  ApiFindAllCampaigns,
  ApiFindOneCampaign,
  ApiUpdateCampaignClient,
} from './docs/campaigns.controller.swagger';
import { plainToInstance } from 'class-transformer';
import { CampaignsEntity } from './entities/campaigns.entity';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('campaigns')
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @ApiFindOneCampaign()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  async findOne(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const campaign = await this.campaignsService.findOneCampaign(campaignId);

    return plainToInstance(CampaignsEntity, campaign);
  }

  @ApiFindAllCampaigns()
  @Get()
  @UseGuards(RolesGuard)
  async findAll(@Query() query: CampaignQueryDTO) {
    const campaigns = await this.campaignsService.findAllCampaigns(query);
    return plainToInstance(CampaignsEntity, campaigns);
  }

  @ApiUpdateCampaignClient()
  @Patch('client/:publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
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
