import { Body, Controller, Get, Logger, Param, Patch } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import {
  ApiFindProposal,
  ApiFindProposalByCampaign,
  ApiRejectProposal,
  ApiAcceptProposal,
  ApiFindAllProposalHistory,
  ApiReviseProposal,
  ApiCancelProposal,
} from './docs/proposals.controller.swagger';
import { NotificationsService } from '../notifications/notifications.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalActions, ProposalStatus } from '@prisma/client';
import { plainToInstance } from 'class-transformer';
import { ProposalsEntity } from './entities/proposals.entity';
import { ProposalHistoryService } from './proposal-history.service';
import { UpdateProposalHistoryCommentDTO } from './dto/update-proposal-history-comment.dto';
import { ProposalHistoryEntity } from './entities/proposal-history.entity';

@Controller('proposals')
export class ProposalsController {
  private logger = new Logger(ProposalsController.name);
  constructor(
    private readonly proposalsService: ProposalsService,
    private readonly proposalHistoryService: ProposalHistoryService,
    private readonly notificationsService: NotificationsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindProposal()
  @Get(':publicId')
  async findOneActive(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const proposal = await this.proposalsService.findActiveProposal(proposalId);

    return plainToInstance(ProposalsEntity, proposal);
  }

  @ApiFindProposalByCampaign()
  @Get('/campaign/:publicId')
  async findOneByCampaign(@Param('publicId') publicId: string) {
    const campaignPublicId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const proposal =
      this.proposalsService.findProposalByCampaignId(campaignPublicId);

    return plainToInstance(ProposalsEntity, proposal);
  }

  @ApiReviseProposal()
  @Patch('revise/:publicId')
  async revise(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProposalHistoryCommentDTO,
  ) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const proposal = await this.proposalsService.findActiveProposal(proposalId);
    const lastestVersion =
      await this.proposalHistoryService.findLatestVersion(proposalId);

    const updated = await this.proposalHistoryService.updateClientComments(
      lastestVersion.history_id,
      dto,
    );

    await this.proposalHistoryService.updateProposalActions(
      lastestVersion.history_id,
      {
        action: ProposalActions.REVISE,
      },
    );

    try {
      const campaign = await this.campaignsService.findOneCampaign(
        proposal.campaign_id,
      );

      await this.notificationsService.createNotification({
        userId: campaign.ugc_creator_id,
        title: 'Your Proposal Has New comments',
        message: `Comment for your proposal: ${updated.client_comments}`,
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification`, err);
    }

    return plainToInstance(ProposalHistoryEntity, updated);
  }

  @ApiRejectProposal()
  @Patch('/reject/:publicId')
  async reject(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);

    const updatedProposal = await this.proposalsService.updateProposalStatus(
      proposalId,
      {
        proposalStatus: ProposalStatus.REJECTED,
      },
    );

    const lastestVersion =
      await this.proposalHistoryService.findLatestVersion(proposalId);

    await this.proposalHistoryService.updateProposalActions(
      lastestVersion.history_id,
      {
        action: ProposalActions.REJECT,
      },
    );

    try {
      const campaign = await this.campaignsService.findOneCampaign(
        updatedProposal.campaign_id,
      );

      await this.notificationsService.createNotification({
        userId: campaign.ugc_creator_id,
        title: `Your Proposal Has Been Rejected.`,
        message:
          'Unfortunately, your proposal has been rejected by the client.',
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification`, err);
    }

    return plainToInstance(ProposalsEntity, updatedProposal);
  }

  @ApiAcceptProposal()
  @Patch('/accept/:publicId')
  async accept(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);

    const updatedProposal = await this.proposalsService.updateProposalStatus(
      proposalId,
      {
        proposalStatus: ProposalStatus.ACCEPTED,
      },
    );

    const latestVersion =
      await this.proposalHistoryService.findLatestVersion(proposalId);

    await this.proposalHistoryService.updateProposalActions(
      latestVersion.history_id,
      {
        action: ProposalActions.APPROVE,
      },
    );

    try {
      const campaign = await this.campaignsService.findOneCampaign(
        updatedProposal.campaign_id,
      );

      await this.notificationsService.createNotification({
        userId: campaign.ugc_creator_id,
        title: `Your Proposal Has Been Accepted.`,
        message:
          'Your proposal has been accepted! Please wait for the contract to be signed by the client.',
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification`, err);
    }

    return plainToInstance(ProposalsEntity, updatedProposal);
  }

  @ApiCancelProposal()
  @Patch('/cancel/:publicId')
  async cancel(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);

    const updatedProposal = await this.proposalsService.updateProposalStatus(
      proposalId,
      {
        proposalStatus: ProposalStatus.CANCELLED,
      },
    );

    const lastestVersion =
      await this.proposalHistoryService.findLatestVersion(proposalId);

    await this.proposalHistoryService.updateProposalActions(
      lastestVersion.history_id,
      {
        action: ProposalActions.CANCEL,
      },
    );

    return plainToInstance(ProposalsEntity, updatedProposal);
  }

  @ApiFindAllProposalHistory()
  @Get('/history/:publicId')
  async findAllHistory(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const histories =
      await this.proposalHistoryService.findAllHistoryForProposal(proposalId);

    return plainToInstance(ProposalHistoryEntity, histories);
  }
}
