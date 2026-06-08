import { Body, Controller, Post } from '@nestjs/common';
import { ProposalsService } from './proposals.service';
import { CreateProposalDTO } from './dto/create-proposal.dto';

@Controller('proposals')
export class ProposalsController {
  constructor(private readonly proposalsService: ProposalsService) {}

  @Post()
  create(@Body() dto: CreateProposalDTO) {
    return this.proposalsService.createProposal(dto);
  }
}
