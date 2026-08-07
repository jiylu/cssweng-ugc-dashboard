import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  ApiFindContractByCampaignId,
  ApiFindContractByPublicId,
  ApiSignContract,
  ApiUpdateContractDetails,
} from './docs/contracts.controller.swagger';
import { UpdateContractDTO } from './dto/update-contract.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { ContractsEntity } from './entities/contracts.entity';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindContractByPublicId()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const contractId = await this.contractsService.resolvePublicId(publicId);
    const contract = await this.contractsService.findContractByUID(contractId);

    return plainToInstance(ContractsEntity, contract);
  }

  @ApiFindContractByCampaignId()
  @Get('/campaign/:publicId')
  async findOneByCampaignId(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const contract =
      await this.contractsService.findContractByCampaignId(campaignId);

    return plainToInstance(ContractsEntity, contract);
  }

  @ApiSignContract()
  @Post('/sign/:publicId')
  async sign(@Param('publicId') publicId: string) {
    const contractId = await this.contractsService.resolvePublicId(publicId);
    const contract = await this.contractsService.signContract(contractId);

    return plainToInstance(ContractsEntity, contract);
  }

  @ApiUpdateContractDetails()
  @Patch(':publicId')
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateContractDTO,
  ) {
    const contractId = await this.contractsService.resolvePublicId(publicId);
    const contract = await this.contractsService.updateContractDetails(
      contractId,
      dto,
    );

    return plainToInstance(ContractsEntity, contract);
  }
}
