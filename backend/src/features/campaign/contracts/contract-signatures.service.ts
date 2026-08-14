import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ContractsService } from './contracts.service';
import { StoreSignatureDTO } from './dto/store-signature.dto';
import { CampaignsService } from '../campaigns/campaigns.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContractSignaturesService {
  private readonly logger = new Logger(ContractSignaturesService.name);
  constructor(
    private prisma: PrismaService,
    private contractService: ContractsService,
    private campaignsService: CampaignsService,
  ) {}

  async storeSignature(
    dto: StoreSignatureDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Storing ${dto.signerRole} signature for contract ${dto.contractId}`,
    );

    const contract = await this.contractService.findContractByUID(
      dto.contractId,
      tx,
    );

    const storedSignature = await tx.contractSignatures.create({
      data: {
        contract_id: contract.contract_id,
        signer_role: dto.signerRole,
        signature_url: dto.signatureURL,
        initials_url: dto.initialsURL,
        signed_at: new Date(),
      },
    });

    this.logger.log(
      `Stored ${dto.signerRole} signature for contract ${dto.contractId}`,
    );

    return storedSignature;
  }

  async getSignatures(
    contractId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Getting signatures for contract ${contractId}`);

    const contract = await this.contractService.findContractByUID(
      contractId,
      tx,
    );

    const signatures = await tx.contractSignatures.findMany({
      where: {
        contract_id: contract.contract_id,
      },
    });

    this.logger.debug(
      `Retrieved ${signatures.length} signatures for ${contractId}`,
    );

    return signatures;
  }
  async signContractWithSignature(
    publicId: string,
    dto: Omit<StoreSignatureDTO, 'contractId'>,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const contractId = await this.contractService.resolvePublicId(
        publicId,
        tx,
      );
      const contract = await this.contractService.signContract(
        contractId,
        dto.signerRole,
        tx,
      );
      const campaign = await this.campaignsService.findOneCampaign(
        contract.campaign_id,
        tx,
      );

      await this.storeSignature(
        {
          ...dto,
          contractId: contract.contract_id,
        },
        tx,
      );

      return { contract, campaign };
    });
  }
}
