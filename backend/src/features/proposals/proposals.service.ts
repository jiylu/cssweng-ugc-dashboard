import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProposalDTO } from './dto/create-proposal.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { ProposalStatus } from '@prisma/client';
import { UserService } from '../users/users.service';

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
}
