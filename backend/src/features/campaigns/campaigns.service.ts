import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateCampaignDTO } from './dto/create-campaign.dto';
import {
  CampaignStatus,
  PaymentSchedule,
  Prisma,
  UserRoles,
} from '@prisma/client';
import { CampaignQueryDTO } from './dto/campaign-query-dto';
import { UpdateCampaignStatusDto } from './dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from './dto/update-campaign-client.dto';
import { UpdateCampaignDetailsDTO } from './dto/update-campaign-details.dto';
import { UserService } from '../users/users.service';
import { nanoid } from 'nanoid';
import { UpdatePaidAmountDTO } from './dto/update-paid-amount.dto';

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

    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    this.validateCampaignDates(startDate, endDate);

    const campaign = await tx.campaigns.create({
      data: {
        public_id: publicId,
        ugc_creator_id: dto.ugcId,
        project_name: dto.projectName,
        description: dto.description,
        currency: dto.currency,
        tax: dto.tax,
        pricing: new Prisma.Decimal(dto.pricing),
        platforms: dto.platforms,
        start_date: startDate,
        end_date: endDate,
        payment_schedule: dto.paymentSchedule,
        ...(dto.paymentSchedule === PaymentSchedule.DEPOSIT_50_FINAL_50 && {
          paid_amount: new Prisma.Decimal(dto.pricing).div(2),
        }),
      },
    });

    this.logger.log(
      `Campaign created with id ${campaign.campaign_id} for user ${campaign.ugc_creator_id}`,
    );

    return campaign;
  }

  private validateCampaignDates(startDate: Date, endDate: Date) {
    startDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (startDate < today) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'INVALID_START_DATE',
        message: 'Campaign start date cannot be in the past.',
      });
    }

    if (startDate >= endDate) {
      this.logger.warn(
        `Invalid startDate and endDate input: startDate must be before endDate`,
      );

      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'INVALID_START_DATE_END_DATE',
        message: 'Invalid campaign start date and end date',
      });
    }
  }

  async resolveCampaignPublicId(publicId: string) {
    this.logger.debug(`Finding campaignId for publicId ${publicId}`);

    const campaign = await this.prisma.campaigns.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        campaign_id: true,
      },
    });

    if (!campaign) {
      this.logger.warn(`Campaign with publicId ${publicId} not found.`);
      throw new NotFoundException({
        code: 'CAMPAIGN_NOT_FOUND',
        message: 'Campaign not found.',
      });
    }

    this.logger.log(
      `Campaign with public id ${publicId} resolved: ${campaign.campaign_id}`,
    );

    return campaign.campaign_id;
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
      `Finding campaigns. creatorId=${query.creatorId}, clientId=${query.clientId}, activeOnly=${query.activeOnly}, page=${page}, limit=${limit}`,
    );

    const userId = query.creatorId ?? query.clientId;

    if (!userId) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        code: 'CAMPAIGN_USER_REQUIRED',
        message: 'Either creatorId or clientId must be provided.',
      });
    }

    await this.userService.getActiveUserById(userId);

    const campaigns = await this.prisma.campaigns.findMany({
      where: {
        ...(query.creatorId && { ugc_creator_id: query.creatorId }),
        ...(query.clientId && { client_id: query.clientId }),
        ...(query.activeOnly && {
          campaign_status: CampaignStatus.ACTIVE,
        }),
      },
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
    });

    this.logger.log(`Found ${campaigns.length} campaigns for user ${userId}`);

    return campaigns;
  }

  async findAllActiveCampaignsNoQuery(userId: string) {
    this.logger.debug(`Finding campaigns. creatorId=${userId}`);

    const user = await this.userService.getActiveUserById(userId);

    const campaigns = await this.prisma.campaigns.findMany({
      where: {
        ...(user.role === UserRoles.CREATOR
          ? { ugc_creator_id: user.user_id }
          : { client_id: user.user_id }),
        campaign_status: CampaignStatus.ACTIVE,
      },
      orderBy: { created_at: 'desc' },
    });

    this.logger.log(
      `Found ${campaigns.length} campaigns for user ${user.user_id}`,
    );

    return campaigns;
  }

  async updateCampaignStatus(campaignId: string, dto: UpdateCampaignStatusDto) {
    this.logger.debug(`Updating campaign status for ${campaignId}`);

    const campaign = await this.assertCampaignUpdatable(campaignId);

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

  async assertCampaignUpdatable(campaignId: string) {
    const campaign = await this.findOneCampaign(campaignId);
    const terminalStatuses = [
      CampaignStatus.REJECTED,
      CampaignStatus.COMPLETED,
      CampaignStatus.CANCELLED,
    ] as CampaignStatus[];

    if (terminalStatuses.includes(campaign.campaign_status)) {
      this.logger.warn(
        `Cannot update campaign ${campaign.campaign_id} because current status ${campaign.campaign_status} is terminal.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_STATUS_UPDATE_ERROR',
        message: 'Campaign Status Update Error',
      });
    }

    return campaign;
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

  async updatePaidAmount(campaignId: string, dto: UpdatePaidAmountDTO) {
    this.logger.debug(
      `Updating paid amount for campaign ${campaignId} to ${dto.paidAmount}`,
    );

    const campaign = await this.findOneCampaign(campaignId);

    const updatedCampaign = await this.prisma.campaigns.update({
      where: { campaign_id: campaign.campaign_id },
      data: {
        paid_amount: dto.paidAmount,
      },
    });

    this.logger.log(
      `Updated ${campaign.campaign_id} paid amount to ${updatedCampaign.paid_amount.toString()}`,
    );

    return updatedCampaign;
  }

  async updateCampaignDetails(
    campaignId: string,
    dto: UpdateCampaignDetailsDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating campaign details for ${campaignId}`);

    await this.findOneCampaign(campaignId, tx);

    const updatedCampaign = await tx.campaigns.update({
      where: { campaign_id: campaignId },
      data: {
        ...(dto.projectName !== undefined && {
          project_name: dto.projectName,
        }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
        ...(dto.currency !== undefined && {
          currency: dto.currency,
        }),
        ...(dto.tax !== undefined && {
          tax: dto.tax,
        }),
        ...(dto.pricing !== undefined && {
          pricing: new Prisma.Decimal(dto.pricing),
        }),
        ...(dto.platforms !== undefined && {
          platforms: dto.platforms,
        }),
        ...(dto.startDate !== undefined && {
          start_date: new Date(dto.startDate),
        }),
        ...(dto.endDate !== undefined && {
          end_date: new Date(dto.endDate),
        }),
      },
    });

    this.logger.log(`Campaign details for ${campaignId} updated successfully`);

    return updatedCampaign;
  }
}
