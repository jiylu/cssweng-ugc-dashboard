import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { UpdateProposalStatusDTO } from './dto/update-proposal-status.dto';
import { UpdateProposalCommentDTO } from './dto/update-proposal-comment.dto';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Get(':proposalId')
  findOneActive(@Param('proposalId') proposalId: string) {
    return this.proposalsService.findActiveProposal(proposalId);
  }

  @Patch(':proposalId/comments')
  updateComments(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalCommentDTO,
  ) {
    return this.proposalsService.updateProposalComments(proposalId, dto);
  }

  @Patch(':proposalId/status')
  updateStatus(
    @Param('proposalId') proposalId: string,
    @Body() dto: UpdateProposalStatusDTO,
  ) {
    return this.proposalsService.updateProposalStatus(proposalId, dto);
  }
}
