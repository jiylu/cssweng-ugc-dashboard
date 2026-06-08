import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProposalDTO } from './dto/create-proposal.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalStatus } from '@prisma/client';
import { UserService } from '../users/users.service';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';

@Injectable()
export class ProposalsService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private userService: UserService,
  ) {}

  private async assertClientHasNoActiveEngagement(clientEmail: string) {
    const clientUser =
      await this.userService.findActiveUserByEmail(clientEmail);

    if (clientUser) {
      const activeCampaign =
        await this.campaignService.findOneActiveCampaignByClientId(
          clientUser.user_id,
        );

      if (activeCampaign) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          code: 'CLIENT_HAS_ACTIVE_CAMPAIGN',
          message: 'Client has Active Campaign',
        });
      }
    }

    const activeProposal =
      await this.findActiveProposalByClientEmail(clientEmail);

    if (activeProposal) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'CLIENT_HAS_ACTIVE_PROPOSAL',
        message: 'Client has Active Proposal',
      });
    }
  }

  async createProposal(dto: CreateProposalDTO) {
    await this.campaignService.findOneCampaign(dto.campaignId);
    await this.assertClientHasNoActiveEngagement(dto.clientEmail);

    return this.prisma.proposals.create({
      data: {
        campaign_id: dto.campaignId,
        client_email: dto.clientEmail,
      },
    });
  }

  async findActiveProposalByClientEmail(clientEmail: string) {
    return await this.prisma.proposals.findFirst({
      where: {
        client_email: clientEmail,
        OR: [
          {
            proposal_status: ProposalStatus.FOR_REVISION,
          },
          {
            proposal_status: ProposalStatus.PENDING,
          },
        ],
      },
    });
  }

  async findActiveProposal(proposalId: string) {
    const activeProposal = await this.prisma.proposals.findFirst({
      where: {
        proposal_id: proposalId,
        OR: [
          {
            proposal_status: ProposalStatus.FOR_REVISION,
          },
          {
            proposal_status: ProposalStatus.PENDING,
          },
        ],
      },
    });

    if (!activeProposal) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
    }

    return activeProposal;
  }

  async findProposalByCampaignId(campaignId: string) {
    const proposal = await this.prisma.proposals.findFirst({
      where: {
        campaign_id: campaignId,
      },
    });

    if (!proposal) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'PROPOSAL_NOT_FOUND',
        message: 'Proposal not found',
      });
    }

    return proposal;
  }

  async updateProposalComments(
    proposalId: string,
    dto: UpdateProposalCommentDTO,
  ) {
    await this.findActiveProposal(proposalId);

    return await this.prisma.proposals.update({
      where: { proposal_id: proposalId },
      data: {
        client_comments: dto.comment,
      },
    });
  }

  async updateProposalStatus(proposalId: string, dto: UpdateProposalStatusDTO) {
    const proposal = await this.findActiveProposal(proposalId);
    const terminalStatuses = [
      ProposalStatus.ACCEPTED,
      ProposalStatus.REJECTED,
    ] as ProposalStatus[];

    if (terminalStatuses.includes(proposal.proposal_status)) {
      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'PROPOSAL_STATUS_UPDATE_ERROR',
        message: 'Proposal status update error',
      });
    }

    return await this.prisma.proposals.update({
      where: { proposal_id: proposalId },
      data: {
        proposal_status: dto.proposalStatus,
      },
    });
  }
}
