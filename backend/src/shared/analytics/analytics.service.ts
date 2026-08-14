import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from '../../features/user/users/users.service';
import { CampaignStatus } from '@prisma/client';
import { ProposalsService } from '../../features/campaign/proposals/proposals.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private proposalService: ProposalsService,
  ) {}

  async generateAnalyticsForUser(userId: string) {
    this.logger.debug(`Generating analytics for ${userId}`);

    const user = await this.userService.getActiveUserById(userId);

    const activeCampaigns = await this.getActiveCampaignsForUser(user.user_id);
    const pendingProposals =
      await this.generatePendingProposalsAnalytics(activeCampaigns);
    const completedCampaigns = await this.getCompletedCampaignsForUser(
      user.user_id,
    );
    const revenueGenerated = completedCampaigns.reduce(
      (sum, campaign) => sum + campaign.paid_amount.toNumber(),
      0,
    );

    const analytics = {
      active_campaigns: activeCampaigns.length,
      pending_proposals: pendingProposals,
      revenue_generated: revenueGenerated,
      monthly_completed: completedCampaigns.length,
    };

    this.logger.log(`Analytics generated for ${userId}`);

    return analytics;
  }

  private async getActiveCampaignsForUser(userId: string) {
    const activeCampaigns = await this.prisma.campaigns.findMany({
      where: {
        ugc_creator_id: userId,
        campaign_status: CampaignStatus.ACTIVE,
      },
      select: {
        campaign_id: true,
      },
    });

    return activeCampaigns.map((c) => c.campaign_id);
  }

  private async getCompletedCampaignsForUser(userId: string) {
    const completedCampaigns = await this.prisma.campaigns.findMany({
      where: {
        ugc_creator_id: userId,
        campaign_status: CampaignStatus.COMPLETED,
      },
      select: {
        campaign_id: true,
        paid_amount: true,
      },
    });

    return completedCampaigns;
  }

  private async generatePendingProposalsAnalytics(activeCampaigns: string[]) {
    const pendingProposals = await Promise.all(
      activeCampaigns.map((c) =>
        this.proposalService.findProposalByCampaignId(c),
      ),
    );

    return pendingProposals.length;
  }
}
