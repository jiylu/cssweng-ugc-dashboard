import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ContractsService } from './contracts.service';
import { StoreSignatureDTO } from './dto/store-signature.dto';

@Injectable()
export class ContractSignaturesService {
  private readonly logger = new Logger(ContractSignaturesService.name);
  constructor(
    private prisma: PrismaService,
    private contractService: ContractsService,
  ) {}

  async storeSignature(dto: StoreSignatureDTO) {
    this.logger.debug(
      `Storing ${dto.signerRole} signature for contract ${dto.contractId}`,
    );

    const contract = await this.contractService.findContractByUID(
      dto.contractId,
    );

    const storedSignature = await this.prisma.contractSignatures.create({
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

  async getSignatures(contractId: string) {
    this.logger.debug(`Getting signatures for contract ${contractId}`);

    const contract = await this.contractService.findContractByUID(contractId);

    const signatures = await this.prisma.contractSignatures.findMany({
      where: {
        contract_id: contract.contract_id,
      },
    });

    this.logger.debug(
      `Retrieved ${signatures.length} signatures for ${contractId}`,
    );

    return signatures;
  }
}
