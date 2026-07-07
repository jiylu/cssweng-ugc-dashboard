import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  ApiFindContractByPublicId,
  ApiSignContract,
  ApiUpdateContractDetails,
} from './docs/contracts.controller.swagger';
import { UpdateContractDTO } from './dto/update-contract.dto';

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

  @ApiUpdateContractDetails()
  @Patch(':contractId')
  update(
    @Param('contractId') contractId: string,
    @Body() dto: UpdateContractDTO,
  ) {
    return this.contractsService.updateContractDetails(contractId, dto);
  }
}
