import { Injectable } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { ProposalsService } from '../proposals/proposals.service';
import { ActivityLog } from '../activity-log/activity-log.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CampaignSetupService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private deliverableService: DeliverablesService,
    private proposalService: ProposalsService,
  ) {}

  async createFullCampaignService(dto: CreateCampaignRequestDto) {
    return this.prisma.$transaction(async (tx) => {
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
        Promise.all(
          dto.deliverables.map((d) =>
            this.deliverableService.createDeliverable(
              { ...d, campaignId: campaign.campaign_id },
              tx,
            ),
          ),
        ),
      ]);

      return { campaign, proposal, deliverables };
    });
  }
}
