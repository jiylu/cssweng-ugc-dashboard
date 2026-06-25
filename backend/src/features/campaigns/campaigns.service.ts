import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCampaignDTO } from './dto/create-campaign.dto';
import { CampaignStatus, Prisma, UserRoles } from '@prisma/client';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';
import { UserService } from '../users/users.service';
import { nanoid } from 'nanoid';

@Injectable()
export class CampaignsService {
  private readonly logger = new Logger(CampaignsService.name);
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createCampaign(
    dto: CreateCampaignDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating campaign for user ${dto.ugcId} with project name ${dto.projectName}.`,
    );

    await this.userService.getActiveUserById(dto.ugcId);
    const publicId = nanoid(10);

    const campaign = await tx.campaigns.create({
      data: {
        public_id: publicId,
        ugc_creator_id: dto.ugcId,
        project_name: dto.projectName,
        description: dto.description,
        pricing: new Prisma.Decimal(dto.pricing),
        start_date: new Date(dto.startDate),
        end_date: new Date(dto.endDate),
      },
    });

    this.logger.log(
      `Campaign created with id ${campaign.campaign_id} for user ${campaign.ugc_creator_id}`,
    );

    return campaign;
  }

  async findOneCampaign(
    campaignId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding campaign with id ${campaignId}`);
    const campaign = await tx.campaigns.findFirst({
      where: {
        campaign_id: campaignId,
      },
    });

    if (!campaign) {
      this.logger.warn(`Campaign ${campaignId} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found',
      });
    }

    this.logger.log(`Found campaign ${campaign.campaign_id}`);
    return campaign;
  }

  async findOneActiveCampaignByPublicId(publicId: string) {
    this.logger.debug(`Finding active campaign with publicId ${publicId}`);

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        public_id: publicId,
        campaign_status: CampaignStatus.ACTIVE,
      },
    });

    if (!campaign) {
      this.logger.warn(`No active campaign found with publicId ${publicId}`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found',
      });
    }

    this.logger.log(
      `Found active campaign with publicId ${publicId} with campaignId ${campaign.campaign_id}`,
    );

    return campaign;
  }

  async findOneActiveCampaignByClientId(clientId: string) {
    this.logger.debug(`Finding active campaign for ${clientId}`);

    await this.userService.getActiveUserById(clientId);

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        client_id: clientId,
        campaign_status: CampaignStatus.ACTIVE,
      },
    });

    if (!campaign) {
      this.logger.debug(`No active campaign found for client ${clientId}`);
      return null;
    }

    this.logger.debug(`Found active campaign for client ${clientId}`);
    return campaign;
  }

  async findAllCampaigns(query: CampaignQueryDTO) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    this.logger.debug(
      `Finding campaigns. creatorId=${query.creatorId}, activeOnly=${query.activeOnly}, page=${page}, limit=${limit}`,
    );

    await this.userService.getActiveUserById(query.creatorId);

    const campaigns = await this.prisma.campaigns.findMany({
      where: {
        ...(query.creatorId && { ugc_creator_id: query.creatorId }),
        ...(query.activeOnly && {
          campaign_status: CampaignStatus.ACTIVE,
        }),
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    this.logger.debug(
      `Found ${campaigns.length} campaigns for creator ${query.creatorId}`,
    );

    return campaigns;
  }

  async updateCampaignStatus(campaignId: string, dto: UpdateCampaignStatusDto) {
    this.logger.debug(`Updating campaign status for ${campaignId}`);

    const campaign = await this.findOneCampaign(campaignId);
    const terminalStatuses = [
      CampaignStatus.REJECTED,
      CampaignStatus.COMPLETED,
    ] as CampaignStatus[];

    if (terminalStatuses.includes(campaign.campaign_status)) {
      this.logger.warn(
        `Cannot update status for ${campaign.campaign_id} from ${campaign.campaign_status} to ${dto.campaignStatus} because current status is terminal.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_STATUS_UPDATE_ERROR',
        message: 'Campaign Status Update Error',
      });
    }

    const updatedCampaign = await this.prisma.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        campaign_status: dto.campaignStatus,
      },
    });

    this.logger.log(
      `Campaign status for ${campaign.campaign_id} successfully changed to ${updatedCampaign.campaign_status} from ${campaign.campaign_status}`,
    );

    return updatedCampaign;
  }

  private async assertExistingCampaignAndNoClient(campaignId: string) {
    this.logger.debug(
      `Checking if campaign ${campaignId} exists and it has no client.`,
    );

    const campaign = await this.findOneCampaign(campaignId);

    if (campaign.client_id) {
      this.logger.warn(
        `Campaign ${campaign.campaign_id} already has a client.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_ALREADY_HAS_CLIENT',
        message: 'Campaign Already Has Client',
      });
    }
  }

  private async assertExistingClientIdAndNoActiveEngagement(clientId: string) {
    this.logger.debug(
      `Checking if client id ${clientId} is existing and it has no active engagement`,
    );

    const user = await this.userService.getActiveUserById(clientId);
    const activeCampaign = await this.findOneActiveCampaignByClientId(clientId);

    if (user.role === UserRoles.CREATOR) {
      this.logger.warn(`User ${user.user_id} is not a client.`);

      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        code: 'USER_IS_NOT_CLIENT',
        message: 'User is not a client',
      });
    }

    if (activeCampaign) {
      this.logger.warn(`User ${user.user_id} has an active campaign.`);

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CLIENT_HAS_ACTIVE_CAMPAIGN',
        message: 'Client has Active Campaign',
      });
    }
  }

  async updateCampaignClientId(
    campaignId: string,
    dto: UpdateCampaignClientDTO,
  ) {
    this.logger.debug(`Updating client id for campaign ${campaignId}.`);

    await this.assertExistingCampaignAndNoClient(campaignId);
    await this.assertExistingClientIdAndNoActiveEngagement(dto.clientId);

    const updatedCampaign = await this.prisma.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        client_id: dto.clientId,
      },
    });

    this.logger.log(
      `Updated client id for campaign ${campaignId} to client id ${dto.clientId}.`,
    );

    return updatedCampaign;
  }
}
