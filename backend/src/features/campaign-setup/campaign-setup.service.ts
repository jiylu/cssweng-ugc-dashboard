import { Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { ProposalsService } from '../proposals/proposals.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { Action, EntityType } from '@prisma/client';

@Injectable()
export class CampaignSetupService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private deliverableService: DeliverablesService,
    private proposalService: ProposalsService,
    private emailService: EmailService,
    private activityLogService: ActivityLogService,
  ) {}

  private readonly logger = new Logger(CampaignSetupService.name);

  async createFullCampaignService(dto: CreateCampaignRequestDto) {
    this.logger.debug(
      `Creating create campaign transaction for campaign ${dto.campaign.projectName} for user ${dto.campaign.ugcId}`,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const totalPrice = dto.deliverables.reduce(
        (sum, d) => sum + Number(d.pricing),
        0,
      );

      const campaign = await this.campaignService.createCampaign(
        { ...dto.campaign, pricing: totalPrice },
        tx,
      );

      const [proposal, deliverables] = await Promise.all([
        this.proposalService.createProposal(
          { ...dto.proposal, campaignId: campaign.campaign_id },
          tx,
        ),
        this.deliverableService.createManyDeliverables(
          campaign.campaign_id,
          dto.deliverables.map((d) => ({
            ...d,
            campaignId: campaign.campaign_id,
          })),
          tx,
        ),
      ]);

      return { campaign, proposal, deliverables };
    });

    await this.activityLogService.createActivityLog({
      userId: dto.campaign.ugcId,
      entityType: EntityType.CAMPAIGN,
      entityId: result.campaign.campaign_id,
      action: Action.SUBMISSION,
    });

    await this.emailService
      .sendProposalReminderEmail({
        clientEmail: dto.proposal.clientEmail,
        projectName: dto.campaign.projectName,
      })
      .catch((err) => {
        this.logger.warn('Failed to send proposal reminder email', err);
      });
    return result;
  }
}
