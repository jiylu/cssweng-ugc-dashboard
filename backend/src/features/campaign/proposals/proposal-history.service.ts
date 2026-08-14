import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateProposalHistoryDTO } from './dto/create-proposal-history.dto';
import { UpdateProposalHistoryCommentDTO } from './dto/update-proposal-history-comment.dto';
import { UpdateProposalHistoryActionDTO } from './dto/update-proposal-history-action.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProposalHistoryService {
  private readonly logger = new Logger(ProposalHistoryService.name);

  constructor(private prisma: PrismaService) {}

  async createProposalHistory(
    dto: CreateProposalHistoryDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating proposal history for proposal ${dto.proposalId}`,
    );

    const existingCount = await tx.proposalHistory.count({
      where: { proposal_id: dto.proposalId },
    });

    const versionNumber = existingCount + 1;

    const history = await tx.proposalHistory.create({
      data: {
        proposal_id: dto.proposalId,
        version_number: versionNumber,
        campaign_content: dto.campaignContent,
        proposal_content: dto.proposalContent,
        deliverable_content: dto.deliverableContent,
        contract_content: dto.contractContent,
        add_ons_content: dto.addOnsContent,
        gifted_products_content: dto.giftedProductsContent,
      },
    });

    this.logger.log(
      `Created proposal history ${history.history_id} (v${versionNumber}) for proposal ${dto.proposalId}`,
    );

    return history;
  }

  async findOneHistory(
    historyId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding proposal history ${historyId}`);

    const history = await tx.proposalHistory.findUnique({
      where: { history_id: historyId },
    });

    if (!history) {
      this.logger.warn(`Proposal history ${historyId} not found.`);
      throw new NotFoundException({
        code: 'PROPOSAL_HISTORY_NOT_FOUND',
        message: 'Proposal history not found',
      });
    }

    this.logger.log(`Proposal history ${historyId} found.`);
    return history;
  }

  async updateClientComments(
    historyId: string,
    dto: UpdateProposalHistoryCommentDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Updating client comments for proposal history ${historyId}`,
    );

    await this.findOneHistory(historyId, tx);

    const updated = await tx.proposalHistory.update({
      where: { history_id: historyId },
      data: {
        client_comments: dto.comment,
        updated_at: new Date(),
      },
    });

    this.logger.log(
      `Client comments updated for proposal history ${historyId}`,
    );
    return updated;
  }

  async updateProposalActions(
    historyId: string,
    dto: UpdateProposalHistoryActionDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating action for proposal history ${historyId}`);

    await this.findOneHistory(historyId, tx);

    const updated = await tx.proposalHistory.update({
      where: { history_id: historyId },
      data: {
        action: dto.action,
        updated_at: new Date(),
      },
    });

    this.logger.log(
      `Action updated to ${updated.action} for proposal history ${historyId}`,
    );
    return updated;
  }

  async findLatestVersion(
    proposalId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding latest proposal history version for proposal ${proposalId}`,
    );

    const latestHistory = await tx.proposalHistory.findFirst({
      where: { proposal_id: proposalId },
      orderBy: { version_number: 'desc' },
    });

    if (!latestHistory) {
      this.logger.warn(`No proposal history found for proposal ${proposalId}.`);

      throw new NotFoundException({
        code: 'PROPOSAL_HISTORY_NOT_FOUND',
        message: 'Proposal history not found',
      });
    }

    this.logger.log(
      `Latest version (v${latestHistory.version_number}) found for proposal ${proposalId}.`,
    );
    return latestHistory;
  }

  async findAllHistoryForProposal(
    proposalId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Finding all proposal history for proposal ${proposalId}`,
    );

    const histories = await tx.proposalHistory.findMany({
      where: { proposal_id: proposalId },
      orderBy: { version_number: 'asc' },
    });

    this.logger.log(
      `Found ${histories.length} history entries for proposal ${proposalId}.`,
    );
    return histories;
  }
}
