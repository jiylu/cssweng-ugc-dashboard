import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';
import {
  ApiFindProposal,
  ApiFindProposalByCampaign,
  ApiUpdateProposalComments,
  ApiUpdateProposalStatus,
} from './docs/proposals.controller.swagger';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @ApiFindProposal()
  @Get(':proposalId')
  findOneActive(@Param('proposalId') proposalId: string) {
    return this.proposalsService.findActiveProposal(proposalId);
  }

  @ApiFindProposalByCampaign()
  @Get('/campaign/:campaignId')
  findOneByCampaign(@Param('campaignId') campaignId: string) {
    return this.proposalsService.findProposalByCampaignId(campaignId);
  }

  @ApiUpdateProposalComments()
  @Patch(':proposalId/comments')
  updateComments(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalCommentDTO,
  ) {
    return this.proposalsService.updateProposalComments(proposalId, dto);
  }

  @ApiUpdateProposalStatus()
  @Patch(':proposalId/status')
  updateStatus(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalStatusDTO,
  ) {
    return this.proposalsService.updateProposalStatus(proposalId, dto);
  }
}
