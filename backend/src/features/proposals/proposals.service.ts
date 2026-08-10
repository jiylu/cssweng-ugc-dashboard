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
import { Prisma, ProposalStatus, User } from '@prisma/client';
import { UserService } from '../users/users.service';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private userService: UserService,
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

  private async assertClientHasNoActiveEngagement(clientEmail: string) {
    this.logger.debug(
      `Checking if client email ${clientEmail} has no active campaigns`,
    );

    const clientUser =
      await this.userService.findActiveUserByEmail(clientEmail);

    await this.checkIfClientUserHasActiveCampaign(clientUser);

    const activeProposal =
      await this.findActiveProposalByClientEmail(clientEmail);

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
    await this.assertClientHasNoActiveEngagement(dto.clientEmail);

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

  async findActiveProposalByClientEmail(clientEmail: string) {
    this.logger.debug(`Finding active proposal for ${clientEmail}`);

    const activeProposal = await this.prisma.proposals.findFirst({
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

  async resolvePublicId(publicId: string) {
    this.logger.debug(`Finding proposal with publicId ${publicId}`);

    const proposal = await this.prisma.proposals.findFirst({
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

  async findActiveProposal(proposalId: string) {
    this.logger.debug(`Finding active proposal ${proposalId}`);

    const activeProposal = await this.prisma.proposals.findFirst({
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
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding proposal for campaign ${campaignId}`);

    const proposal = await tx.proposals.findFirst({
      where: {
        campaign_id: campaignId,
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

  async updateProposalComments(
    proposalId: string,
    dto: UpdateProposalCommentDTO,
  ) {
    this.logger.debug(`Updating comments for proposal ${proposalId}`);

    await this.findActiveProposal(proposalId);

    const updated = await this.prisma.proposals.update({
      where: { proposal_id: proposalId },
      data: { client_comments: dto.comment },
    });

    this.logger.log(`Comments updated for proposal ${proposalId}`);
    return updated;
  }

  async updateProposalStatus(proposalId: string, dto: UpdateProposalStatusDTO) {
    this.logger.debug(`Updating status for proposal ${proposalId}`);

    await this.findActiveProposal(proposalId);

    const updated = await this.prisma.proposals.update({
      where: { proposal_id: proposalId },
      data: { proposal_status: dto.proposalStatus },
    });

    this.logger.log(
      `Proposal ${proposalId} status updated to ${updated.proposal_status}`,
    );
    return updated;
  }
}
