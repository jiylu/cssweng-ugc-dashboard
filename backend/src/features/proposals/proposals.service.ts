import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateProposalDTO } from './dto/create-proposal.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import {
  CampaignStatus,
  Prisma,
  ProposalActions,
  ProposalStatus,
  User,
} from '@prisma/client';
import { UserService } from '../users/users.service';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { nanoid } from 'nanoid';
import { ProposalHistoryService } from './proposal-history.service';
import { UpdateProposalHistoryCommentDTO } from './dto/update-proposal-history-comment.dto';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private userService: UserService,
    private proposalHistoryService: ProposalHistoryService,
  ) {}

  private logger = new Logger(ProposalsService.name);
  private readonly ACTIVE_PROPOSAL_STATUSES = [
    ProposalStatus.FOR_REVISION,
    ProposalStatus.PENDING,
  ];

  private async checkIfClientUserHasActiveCampaign(clientUser: User | null) {
    if (!clientUser) {
      return;
    }

    const activeCampaign =
      await this.campaignService.findOneActiveCampaignByClientId(
        clientUser.user_id,
      );

    if (activeCampaign) {
      this.logger.warn(
        `Client user ${clientUser.user_id} has an active campaign.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CLIENT_HAS_ACTIVE_CAMPAIGN',
        message: 'Client has Active Campaign',
      });
    }
  }

  private async assertClientHasNoActiveEngagement(
    clientEmail: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Checking if client email ${clientEmail} has no active campaigns`,
    );

    const clientUser =
      await this.userService.findActiveUserByEmail(clientEmail);

    await this.checkIfClientUserHasActiveCampaign(clientUser);

    const activeProposal = await this.findActiveProposalByClientEmail(
      clientEmail,
      tx,
    );

    if (activeProposal) {
      this.logger.warn(`Client ${clientEmail} already has an active proposal.`);

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CLIENT_HAS_ACTIVE_PROPOSAL',
        message: 'Client has Active Proposal',
      });
    }
  }

  async createProposal(
    dto: CreateProposalDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating proposal for client ${dto.clientEmail} for campaign ${dto.campaignId}`,
    );

    await this.campaignService.findOneCampaign(dto.campaignId, tx);
    await this.assertClientHasNoActiveEngagement(dto.clientEmail, tx);

    const publicId = nanoid(10);

    const proposal = await tx.proposals.create({
      data: {
        public_id: publicId,
        campaign_id: dto.campaignId,
        client_email: dto.clientEmail,
        client_first_name: dto.client_first_name,
        client_last_name: dto.client_last_name,
      },
    });

    this.logger.log(
      `Successfully created proposal ${proposal.proposal_id} for client ${proposal.client_email} for campaign ${proposal.campaign_id}`,
    );

    return proposal;
  }

  async findActiveProposalByClientEmail(
    clientEmail: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding active proposal for ${clientEmail}`);

    const activeProposal = await tx.proposals.findFirst({
      where: {
        client_email: clientEmail,
        proposal_status: { in: this.ACTIVE_PROPOSAL_STATUSES },
      },
    });

    if (!activeProposal) {
      this.logger.debug(`Client ${clientEmail} has no active proposal.`);
      return null;
    }

    this.logger.debug(
      `Client ${clientEmail} has an active proposal ${activeProposal.proposal_id}`,
    );

    return activeProposal;
  }

  async findProposalsForUser(userId: string) {
    this.logger.debug(`Finding proposals for user ${userId}`);

    const user = await this.userService.getActiveUserById(userId);

    const activeCampaigns =
      await this.campaignService.findAllActiveCampaignsNoQuery(user.user_id);

    if (activeCampaigns.length === 0) {
      this.logger.log(`No active proposals for user ${userId}.`);
      return [];
    }

    const proposals = await Promise.all(
      activeCampaigns.map((campaign) =>
        this.findProposalByCampaignId(campaign.campaign_id, true),
      ),
    );

    this.logger.log(
      `Found ${proposals.length} proposals for user ${user.user_id}`,
    );

    return proposals;
  }

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding proposal with publicId ${publicId}`);

    const proposal = await tx.proposals.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        proposal_id: true,
      },
    });

    if (!proposal) {
      this.logger.warn(`Proposal with publicId ${publicId} not found`);
      throw new NotFoundException({
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found.',
      });
    }

    this.logger.log(
      `Proposal with public id ${publicId} resolved: ${proposal.proposal_id}`,
    );

    return proposal.proposal_id;
  }

  async findActiveProposal(
    proposalId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding active proposal ${proposalId}`);

    const activeProposal = await tx.proposals.findFirst({
      where: {
        proposal_id: proposalId,
        proposal_status: { in: this.ACTIVE_PROPOSAL_STATUSES },
      },
    });

    if (!activeProposal) {
      this.logger.debug(
        `Proposal ${proposalId} is not active or does not exist.`,
      );

      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
    }

    this.logger.log(`Active proposal ${proposalId} found.`);
    return activeProposal;
  }

  async findProposalByCampaignId(
    campaignId: string,
    isPending: boolean = false,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding proposal for campaign ${campaignId}`);

    const proposal = await tx.proposals.findFirst({
      where: {
        campaign_id: campaignId,
        ...(isPending && { proposal_status: ProposalStatus.PENDING }),
      },
    });

    if (!proposal) {
      this.logger.warn(`Proposal for campaign ${campaignId} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
    }

    this.logger.log(
      `Found proposal ${proposal.proposal_id} for campaign ${campaignId}`,
    );
    return proposal;
  }

  async updateProposalStatus(
    proposalId: string,
    dto: UpdateProposalStatusDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating status for proposal ${proposalId}`);

    const proposal = await this.findActiveProposal(proposalId, tx);

    const terminalStatuses = [
      ProposalStatus.REJECTED,
      ProposalStatus.ACCEPTED,
      ProposalStatus.CANCELLED,
    ] as ProposalStatus[];

    if (terminalStatuses.includes(proposal.proposal_status)) {
      this.logger.warn(
        `Cannot update status for ${proposal.proposal_id} from ${proposal.proposal_status} to ${dto.proposalStatus} because current status is terminal.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CAMPAIGN_STATUS_UPDATE_ERROR',
        message: 'Campaign Status Update Error',
      });
    }

    const updated = await tx.proposals.update({
      where: { proposal_id: proposalId },
      data: { proposal_status: dto.proposalStatus },
    });

    this.logger.log(
      `Proposal ${proposalId} status updated to ${updated.proposal_status}`,
    );
    return updated;
  }

  async reviseProposal(publicId: string, dto: UpdateProposalHistoryCommentDTO) {
    return this.prisma.$transaction(async (tx) => {
      const proposalId = await this.resolvePublicId(publicId, tx);
      const proposal = await this.findActiveProposal(proposalId, tx);
      const latestVersion = await this.proposalHistoryService.findLatestVersion(
        proposalId,
        tx,
      );

      const updatedHistory =
        await this.proposalHistoryService.updateClientComments(
          latestVersion.history_id,
          dto,
          tx,
        );

      await this.proposalHistoryService.updateProposalActions(
        latestVersion.history_id,
        {
          action: ProposalActions.REVISE,
        },
        tx,
      );

      const campaign = await this.campaignService.findOneCampaign(
        proposal.campaign_id,
        tx,
      );

      return { proposal, updatedHistory, campaign };
    });
  }

  async rejectProposal(publicId: string) {
    return this.prisma.$transaction(async (tx) => {
      const proposalId = await this.resolvePublicId(publicId, tx);
      const proposal = await this.findActiveProposal(proposalId, tx);
      await this.campaignService.assertCampaignUpdatable(
        proposal.campaign_id,
        tx,
      );

      const updatedProposal = await this.updateProposalStatus(
        proposalId,
        {
          proposalStatus: ProposalStatus.REJECTED,
        },
        tx,
      );

      const latestVersion = await this.proposalHistoryService.findLatestVersion(
        proposalId,
        tx,
      );
      const campaign = await this.campaignService.findOneCampaign(
        updatedProposal.campaign_id,
        tx,
      );

      await this.campaignService.updateCampaignStatus(
        campaign.campaign_id,
        {
          campaignStatus: CampaignStatus.REJECTED,
        },
        tx,
      );

      await this.proposalHistoryService.updateProposalActions(
        latestVersion.history_id,
        {
          action: ProposalActions.REJECT,
        },
        tx,
      );

      return { updatedProposal, campaign };
    });
  }

  async acceptProposal(publicId: string) {
    return this.prisma.$transaction(async (tx) => {
      const proposalId = await this.resolvePublicId(publicId, tx);
      const updatedProposal = await this.updateProposalStatus(
        proposalId,
        {
          proposalStatus: ProposalStatus.ACCEPTED,
        },
        tx,
      );

      const latestVersion = await this.proposalHistoryService.findLatestVersion(
        proposalId,
        tx,
      );

      await this.proposalHistoryService.updateProposalActions(
        latestVersion.history_id,
        {
          action: ProposalActions.APPROVE,
        },
        tx,
      );

      const campaign = await this.campaignService.findOneCampaign(
        updatedProposal.campaign_id,
        tx,
      );

      return { updatedProposal, campaign };
    });
  }

  async cancelProposal(publicId: string) {
    return this.prisma.$transaction(async (tx) => {
      const proposalId = await this.resolvePublicId(publicId, tx);
      const proposal = await this.findActiveProposal(proposalId, tx);
      await this.campaignService.assertCampaignUpdatable(
        proposal.campaign_id,
        tx,
      );

      const updatedProposal = await this.updateProposalStatus(
        proposalId,
        {
          proposalStatus: ProposalStatus.CANCELLED,
        },
        tx,
      );

      const campaign = await this.campaignService.findOneCampaign(
        updatedProposal.campaign_id,
        tx,
      );

      await this.campaignService.updateCampaignStatus(
        campaign.campaign_id,
        {
          campaignStatus: CampaignStatus.CANCELLED,
        },
        tx,
      );

      const latestVersion = await this.proposalHistoryService.findLatestVersion(
        proposalId,
        tx,
      );

      await this.proposalHistoryService.updateProposalActions(
        latestVersion.history_id,
        {
          action: ProposalActions.CANCEL,
        },
        tx,
      );

      return updatedProposal;
    });
  }
}
