import { Body, Controller, Get, Logger, Param, Patch, UseGuards } from '@nestjs/common';
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
  ApiFindActiveProposalByClientEmail,
  ApiUpdateProposalStatus,
  ApiUpdateProposalComment,
} from './docs/proposals.controller.swagger';
import { NotificationsService } from '../../../shared/notifications/notifications.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { ProposalsEntity } from './entities/proposals.entity';
import { ProposalHistoryService } from './proposal-history.service';
import { UpdateProposalHistoryCommentDTO } from './dto/update-proposal-history-comment.dto';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { ProposalHistoryEntity } from './entities/proposal-history.entity';
import { ProposalStatus, UserRoles } from '@prisma/client';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';

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
  @UseGuards(RolesGuard)
  async findOneActive(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const proposal = await this.proposalsService.findActiveProposal(proposalId);

    return plainToInstance(ProposalsEntity, proposal);
  }

  @ApiFindProposalsForUser()
  @Get('user/:userId')
  @UseGuards(RolesGuard)
  async findProposalsForUser(@Param('userId') userId: string) {
    const proposals = await this.proposalsService.findProposalsForUser(userId);

    return plainToInstance(ProposalsEntity, proposals);
  }

  @ApiFindActiveProposalByClientEmail()
  @Get('active/:clientEmail')
  @UseGuards(RolesGuard)
  async findActiveProposalByClientEmail(
    @Param('clientEmail') clientEmail: string,
  ) {
    const proposal =
      await this.proposalsService.findActiveProposalByClientEmail(clientEmail);

    return plainToInstance(ProposalsEntity, proposal);
  }

  @ApiFindProposalByCampaign()
  @Get('/campaign/:publicId')
  @UseGuards(RolesGuard)
  async findOneByCampaign(@Param('publicId') publicId: string) {
    const campaignPublicId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const proposal =
      this.proposalsService.findProposalByCampaignId(campaignPublicId);

    return plainToInstance(ProposalsEntity, proposal);
  }

  @ApiUpdateProposalStatus()
  @Patch('status/:publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
  async updateStatus(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProposalStatusDTO,
  ) {
    if (dto.proposalStatus === ProposalStatus.REJECTED) {
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

    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const updatedProposal = await this.proposalsService.updateProposalStatus(
      proposalId,
      dto,
    );

    return plainToInstance(ProposalsEntity, updatedProposal);
  }

  @ApiUpdateProposalComment()
  @Patch(':publicId/comments')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
  async updateComments(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateProposalCommentDTO,
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

  @ApiReviseProposal()
  @Patch('revise/:publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
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
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
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
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
  async accept(@Param('publicId') publicId: string) {
    const { updatedProposal, updatedCampaign } =
      await this.proposalsService.acceptProposal(publicId);

    try {
      await this.notificationsService.createNotification({
        userId: updatedCampaign.ugc_creator_id,
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
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async cancel(@Param('publicId') publicId: string) {
    const updatedProposal =
      await this.proposalsService.cancelProposal(publicId);

    return plainToInstance(ProposalsEntity, updatedProposal);
  }

  @ApiFindAllProposalHistory()
  @Get('/history/:publicId')
  @UseGuards(RolesGuard)
  async findAllHistory(@Param('publicId') publicId: string) {
    const proposalId = await this.proposalsService.resolvePublicId(publicId);
    const histories =
      await this.proposalHistoryService.findAllHistoryForProposal(proposalId);

    return plainToInstance(ProposalHistoryEntity, histories);
  }
}
