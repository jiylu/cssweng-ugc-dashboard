import { Controller, Get, Param, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  ApiFindContractByPublicId,
  ApiSignContract,
} from './docs/contracts.controller.swagger';

@Controller('contracts')
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @ApiFindContractByPublicId()
  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.contractsService.findContractByPublicId(publicId);
  }

  @ApiSignContract()
  @Post('/sign/:publicId')
  sign(@Param('publicId') publicId: string) {
    return this.contractsService.signContract(publicId);
  }
}
