import { Body, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';
import {
  ApiFindProposal,
  ApiFindProposalByCampaign,
  ApiUpdateProposalComments,
  ApiUpdateProposalStatus,
} from './docs/proposals.controller.swagger';
import { NotificationsService } from '../notifications/notifications.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalStatus } from '@prisma/client';

@Controller('proposals')
export class ProposalsController {
  private logger = new Logger(ProposalsController.name);
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly notificationsService: NotificationsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindProposal()
  @Get(':publicId')
  findOneActive(@Param('publicId') publicId: string) {
    return this.proposalsService.findActiveProposalByPublicId(publicId);
  }

  @ApiFindProposalByCampaign()
  @Get('/campaign/:campaignId')
  findOneByCampaign(@Param('campaignId') campaignId: string) {
    return this.proposalsService.findProposalByCampaignId(campaignId);
  }

  @ApiUpdateProposalComments()
  @Patch(':proposalId/comments')
  async updateComments(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalCommentDTO,
  ) {
    const updatedProposal = await this.proposalsService.updateProposalComments(
      proposalId,
      dto,
    );

    try {
      const campaign = await this.campaignsService.findOneCampaign(
        updatedProposal.campaign_id,
      );

      await this.notificationsService.createNotification({
        userId: campaign.ugc_creator_id,
        title: 'Your Proposal Has New comments',
        message: `Comment for your proposal: ${updatedProposal.client_comments}`,
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification`, err);
    }

    return updatedProposal;
  }

  @ApiUpdateProposalStatus()
  @Patch(':proposalId/status')
  async updateStatus(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalStatusDTO,
  ) {
    const notifiableStatuses = [
      ProposalStatus.ACCEPTED,
      ProposalStatus.REJECTED,
    ] as ProposalStatus[];

    const updatedProposal = await this.proposalsService.updateProposalStatus(
      proposalId,
      dto,
    );

    if (notifiableStatuses.includes(updatedProposal.proposal_status)) {
      try {
        const campaign = await this.campaignsService.findOneCampaign(
          updatedProposal.campaign_id,
        );

        const notificationMessage =
          updatedProposal.proposal_status === ProposalStatus.ACCEPTED
            ? 'Your proposal has been accepted! You may now start with the campaign.'
            : 'Unfortunately, your proposal has been rejected by the client.';

        await this.notificationsService.createNotification({
          userId: campaign.ugc_creator_id,
          title: `Your Proposal Has Been ${updatedProposal.proposal_status}`,
          message: notificationMessage,
        });
      } catch (err) {
        this.logger.warn(`Failed to send notification`, err);
      }
    }

    return updatedProposal;
  }
}
