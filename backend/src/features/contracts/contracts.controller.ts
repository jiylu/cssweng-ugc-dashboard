import { Controller, Get, Param, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.contractsService.findContractByPublicId(publicId);
  }

  @Post('/sign/:publicId')
  sign(@Param('publicId') publicId: string) {
    return this.contractsService.signContract(publicId);
  }
}
