import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ContractsService } from './contracts.service';
import {
  ApiFindContractByCampaignId,
  ApiFindContractByPublicId,
  ApiSignContract,
  ApiUpdateContractDetails,
  ApiGetContractSignatures,
} from './docs/contracts.controller.swagger';
import { UpdateContractDTO } from './dto/update-contract.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { ContractsEntity } from './entities/contracts.entity';
import { SignContractDTO } from './dto/sign-contract.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/shared/upload/upload.service';
import { ContractSignaturesService } from './contract-signatures.service';
import { ContractSignaturesEntity } from './entities/contract-signatures.entity';
@Controller('contracts')
export class ContractsController {
  constructor(
    private readonly contractsService: ContractsService,
    private readonly contractSignatureService: ContractSignaturesService,
    private readonly campaignsService: CampaignsService,
    private readonly notificationsService: NotificationsService,
    private readonly uploadService: UploadService,
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

    const contract = await this.contractsService.findContractByCampaignId(
      campaign.campaign_id,
    );

    return plainToInstance(ContractsEntity, contract);
  }

  @ApiGetContractSignatures()
  @Get('/signatures/:publicId')
  async findManySignatures(@Param('publicId') publicId: string) {
    const contractId = await this.contractsService.resolvePublicId(publicId);

    const signatures =
      await this.contractSignatureService.getSignatures(contractId);

    return plainToInstance(ContractSignaturesEntity, signatures);
  }

  @ApiSignContract()
  @Post('/sign/:publicId')
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'signature', maxCount: 1 },
      { name: 'initials', maxCount: 1 },
    ]),
  )
  async sign(
    @UploadedFiles()
    files: {
      signature?: Express.Multer.File[];
      initials?: Express.Multer.File[];
    },
    @Param('publicId') publicId: string,
    @Body() dto: SignContractDTO,
  ) {
    const signatureFile = files.signature?.[0];
    const initialsFile = files.initials?.[0];
    const promises: Promise<{
      upload_type: string;
      url: string;
      type: 'image' | 'video';
    }>[] = [];

    if (signatureFile) {
      promises.push(
        this.uploadService
          .upload(signatureFile)
          .then((result) => ({ upload_type: 'signature', ...result })),
      );
    }

    if (initialsFile) {
      promises.push(
        this.uploadService
          .upload(initialsFile)
          .then((result) => ({ upload_type: 'initials', ...result })),
      );
    }

    const [signatureData, initialsData] = await Promise.all(promises);

    const contractId = await this.contractsService.resolvePublicId(publicId);
    const contract = await this.contractsService.signContract(
      contractId,
      dto.signerRole,
    );

    const campaign = await this.campaignsService.findOneCampaign(
      contract.campaign_id,
    );

    await this.contractSignatureService.storeSignature({
      contractId: contract.contract_id,
      signerRole: dto.signerRole,
      signatureURL: signatureData.url,
      initialsURL: initialsData.url,
    });

    await this.notificationsService.createNotification({
      userId: campaign.ugc_creator_id,
      title: `Contract Signed For:  ${campaign.project_name}`,
      message: `Your client has signed the contract for ${campaign.project_name}, you may now sign the contract.`,
    });

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
