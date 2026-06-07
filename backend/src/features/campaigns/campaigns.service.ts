import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignDTO } from './dto/create-campaign.dto';
import { CampaignStatus, Prisma } from '@prisma/client';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async createCampaign(dto: CreateCampaignDTO) {
    return await this.prisma.campaigns.create({
      data: {
        ugc_creator_id: dto.ugcId,
        project_name: dto.projectName,
        description: dto.description,
        pricing: new Prisma.Decimal(dto.pricing),
        start_date: new Date(dto.startDate),
        end_date: new Date(dto.endDate),
        campaign_type: dto.campaignType,
      },
    });
  }

  async findOneCampaign(campaignId: string) {
    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        campaign_id: campaignId,
      },
    });

    if (!campaign) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found',
      });
    }

    return campaign;
  }

  async findAllCampaigns(query: CampaignQueryDTO) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    return this.prisma.campaigns.findMany({
      where: {
        ...(query.creatorId && {
          ugc_creator_id: query.creatorId,
        }),
      },
      skip,
      take: limit,
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async updateCampaignStatus(campaignId: string, dto: UpdateCampaignStatusDto) {
    const campaign = await this.findOneCampaign(campaignId);

    if (CampaignStatus.REJECTED === campaign.campaign_status) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_STATUS_UPDATE_ERROR',
        message: 'Campaign Status Update Error',
      });
    }

    return this.prisma.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        campaign_status: dto.campaignStatus,
      },
    });
  }

  async updateCampaignClientId(
    campaignId: string,
    dto: UpdateCampaignClientDTO,
  ) {
    const campaign = await this.findOneCampaign(campaignId);

    if (campaign.client_id) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_ALREADY_HAS_CLIENT',
        body: 'Campaign Already Has Client',
      });
    }

    return this.prisma.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        client_id: dto.clientId,
      },
    });
  }

  async editCampaign(campaignId) {

  }
}
