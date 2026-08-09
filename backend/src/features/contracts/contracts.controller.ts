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
import { NotificationsService } from '../notifications/notifications.service';

@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly campaignsService: CampaignsService,
    private readonly notificationsService: NotificationsService,
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

    const campaign = await this.campaignsService.findOneCampaign(campaignId);

    const contract =
      await this.contractsService.findContractByCampaignId(campaignId);

    await this.notificationsService.createNotification({
      userId: campaign.ugc_creator_id,
      title: `Contract Signed For:  ${campaign.project_name}`,
      message: `Your client has signed the contract for ${campaign.project_name}, you may now sign the contract.`,
    });

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
