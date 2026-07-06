import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateContractDTO } from './dto/create-contract.dto';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';

@Injectable()
export class ContractsService {
  private readonly logger = new Logger(ContractsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
  ) {}

  async createContract(
    dto: CreateContractDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Creating contract for campaign${dto.campaignId}`);

    await this.campaignsService.findOneCampaign(dto.campaignId);

    const publicId = nanoid(10);

    const contract = await tx.contracts.create({
      data: {
        public_id: publicId,
        campaign_id: dto.campaignId,
        revision_policy: { ...dto.revision_policy },
        usage_rights: { ...dto.usage_rights },
        posting_requirements: {
          ...dto.posting_requirements,
        },
        exclusivity: dto.exclusivity ? { ...dto.exclusivity } : undefined,
        expenses_purchases_terms: dto.expenses_purchases_terms
          ? { ...dto.expenses_purchases_terms }
          : undefined,
        cancellation_period: dto.cancellation_period,
        payment_terms: { ...dto.payment_terms },
        invoice_requirements: { ...dto.invoice_requirements },
      },
    });

    this.logger.log(
      `Created contract ${contract.contract_id} for ${contract.contract_id}`,
    );
    return contract;
  }

  async findContractByUID(contractId: string) {
    this.logger.debug(`Finding contract ${contractId}`);

    const contract = await this.prisma.contracts.findFirst({
      where: {
        contract_id: contractId,
      },
    });

    if (!contract) {
      this.logger.warn(`Contract ${contractId} not found`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CONTRACT_NOT_FOUND',
        message: 'Contract not found',
      });
    }

    this.logger.log(`Found contract ${contract.contract_id}`);

    return contract;
  }

  async findContractByPublicId(publicId: string) {
    this.logger.debug(`Finding contract with publicId ${publicId}`);

    const contract = await this.prisma.contracts.findFirst({
      where: {
        public_id: publicId,
      },
    });

    if (!contract) {
      this.logger.warn(`Contract public id ${publicId} not found`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CONTRACT_NOT_FOUND',
        message: 'Contract not found',
      });
    }

    this.logger.log(`Found contract ${contract.contract_id}`);

    return contract;
  }

  async signContract(publicId: string) {
    this.logger.debug(`Signing contract ${publicId}`);

    const unsignedContract = await this.findContractByPublicId(publicId);

    const signedContract = await this.prisma.contracts.update({
      where: { contract_id: unsignedContract.contract_id },
      data: {
        is_signed: true,
        signed_at: new Date(),
      },
    });

    this.logger.debug(
      `Successfully signed contract ${signedContract.contract_id}`,
    );

    return signedContract;
  }
}
