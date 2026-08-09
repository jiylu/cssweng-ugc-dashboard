import { Body, Controller, Get, Logger, Param, Patch, Post } from '@nestjs/common';
import { CampaignSetupService } from './campaign-setup.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import {
  ApiCreateFullCampaign,
  ApiGetFullCampaignDetails,
  ApiUpdateCampaignSetup,
} from './docs/campaign-setup.controller.swagger';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Action, EntityType } from '@prisma/client';
import { UpdateCampaignSetupDto } from './dto/update-campaign-setup.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { CampaignsEntity } from '../campaigns/entities/campaigns.entity';
import { ProposalsEntity } from '../proposals/entities/proposals.entity';
import { DeliverablesEntity } from '../deliverables/entities/deliverables.entity';
import { ContractsEntity } from '../contracts/entities/contracts.entity';
import { AddOnsEntity } from '../add-ons/entities/add-ons.entity';
import { GiftedProductsEntity } from '../gifted-products/entities/gifted-products.entity';
import { EmailService } from '../email/email.service';

@Controller('campaign-setup')
export class CampaignSetupController {
  private readonly logger = new Logger(CampaignSetupController.name);

  constructor(
    private readonly campaignSetupService: CampaignSetupService,
    private readonly activityLogService: ActivityLogService,
    private readonly campaignsService: CampaignsService,
    private readonly emailService: EmailService,
  ) {}

  @ApiCreateFullCampaign()
  @Post()
  async create(@Body() dto: CreateCampaignRequestDto) {
    const result =
      await this.campaignSetupService.createFullCampaignService(dto);

    await this.activityLogService.createActivityLog({
      userId: dto.campaign.ugcId,
      entityType: EntityType.CAMPAIGN,
      entityId: result.campaign.campaign_id,
      action: Action.SUBMISSION,
    });

    await this.emailService
      .sendProposalReminderEmail(
        dto.proposal.clientEmail,
        result.proposal.public_id,
        result.campaign.public_id,
        dto.campaign.projectName,
      )
      .catch((err) => {
        this.logger.warn('Failed to send proposal email:', err);
      });

    return {
      campaign: plainToInstance(CampaignsEntity, result.campaign),
      proposal: plainToInstance(ProposalsEntity, result.proposal),
      deliverables: plainToInstance(DeliverablesEntity, result.deliverables),
      contract: plainToInstance(ContractsEntity, result.contract),
      addOns: plainToInstance(AddOnsEntity, result.addOns),
      giftedProducts: plainToInstance(
        GiftedProductsEntity,
        result.giftedProducts,
      ),
    };
  }

  // TODO: Add activity log
  @ApiUpdateCampaignSetup()
  @Patch(':publicId')
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateCampaignSetupDto,
  ) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const result = await this.campaignSetupService.updateCampaignSetup(
      campaignId,
      dto,
    );

    return {
      campaign: result.campaign
        ? plainToInstance(CampaignsEntity, result.campaign)
        : null,
      contract: result.contract
        ? plainToInstance(ContractsEntity, result.contract)
        : null,
      deliverables: {
        created: plainToInstance(
          DeliverablesEntity,
          result.deliverables.created,
        ),
        updated: plainToInstance(
          DeliverablesEntity,
          result.deliverables.updated,
        ),
        deleted: plainToInstance(
          DeliverablesEntity,
          result.deliverables.deleted,
        ),
      },
      giftedProducts: {
        created: plainToInstance(
          GiftedProductsEntity,
          result.giftedProducts.created,
        ),
        updated: plainToInstance(
          GiftedProductsEntity,
          result.giftedProducts.updated,
        ),
        deleted: plainToInstance(
          GiftedProductsEntity,
          result.giftedProducts.deleted,
        ),
      },
      addOns: {
        created: plainToInstance(AddOnsEntity, result.addOns.created),
        updated: plainToInstance(AddOnsEntity, result.addOns.updated),
        deleted: plainToInstance(AddOnsEntity, result.addOns.deleted),
      },
    };
  }

  @ApiGetFullCampaignDetails()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const result =
      await this.campaignSetupService.getFullCampaignDetails(campaignId);

    return {
      campaign: plainToInstance(CampaignsEntity, result.campaign),
      proposal: plainToInstance(ProposalsEntity, result.proposal),
      deliverables: plainToInstance(DeliverablesEntity, result.deliverables),
      contract: plainToInstance(ContractsEntity, result.contract),
      addOns: plainToInstance(AddOnsEntity, result.addOns),
      giftedProducts: plainToInstance(
        GiftedProductsEntity,
        result.giftedProducts,
      ),
    };
  }
}
