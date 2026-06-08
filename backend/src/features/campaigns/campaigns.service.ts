import {
  ConflictException,
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
import { UserService } from '../users/users.service';

@Injectable()
export class CampaignsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createCampaign(dto: CreateCampaignDTO) {
    await this.userService.getActiveUserById(dto.ugcId);

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

  async findOneActiveCampaignByClientId(clientId: string) {
    await this.userService.getActiveUserById(clientId);

    return await this.prisma.campaigns.findFirst({
      where: {
        client_id: clientId,
        campaign_status: CampaignStatus.ACTIVE,
      },
    });
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
    const terminalStatuses = [
      CampaignStatus.REJECTED,
      CampaignStatus.COMPLETED,
    ] as CampaignStatus[];

    if (terminalStatuses.includes(campaign.campaign_status)) {
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

    await this.userService.getActiveUserById(dto.clientId);

    return this.prisma.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        client_id: dto.clientId,
      },
    });
  }
}
