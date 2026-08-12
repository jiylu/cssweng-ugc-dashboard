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
  ApiFindProposalsForUser,
} from './docs/proposals.controller.swagger';
import { NotificationsService } from '../notifications/notifications.service';
import { CampaignsService } from '../campaigns/campaigns.service';
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

  @ApiFindProposalsForUser()
  @Get('user/:userId')
  async findProposalsForUser(@Param('userId') userId: string) {
    const proposals = await this.proposalsService.findProposalsForUser(userId);

    return plainToInstance(ProposalsEntity, proposals);
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
    const { campaign, updatedHistory } =
      await this.proposalsService.reviseProposal(publicId, dto);

    try {
      await this.notificationsService.createNotification({
        userId: campaign.ugc_creator_id,
        title: 'Your Proposal Has New comments',
        message: `Comment for your proposal: ${updatedHistory.client_comments}`,
      });
    } catch (err) {
      this.logger.warn(`Failed to send notification`, err);
    }

    return plainToInstance(ProposalHistoryEntity, updatedHistory);
  }

  @ApiRejectProposal()
  @Patch('/reject/:publicId')
  async reject(@Param('publicId') publicId: string) {
    const { updatedProposal, campaign } =
      await this.proposalsService.rejectProposal(publicId);

    try {
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
    const { updatedProposal, campaign } =
      await this.proposalsService.acceptProposal(publicId);

    try {
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
    const updatedProposal =
      await this.proposalsService.cancelProposal(publicId);

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
