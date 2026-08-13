import {
  ConflictException,
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateContractDTO } from './dto/create-contract.dto';
import { Prisma, UserRoles } from '@prisma/client';
import { nanoid } from 'nanoid';
import { UpdateContractDTO } from './dto/update-contract.dto';

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

    await this.campaignsService.findOneCampaign(dto.campaignId, tx);

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
        general_terms: { ...dto.general_terms },
        extra_notes: dto.extra_notes ?? undefined,
      },
    });

    this.logger.log(
      `Created contract ${contract.contract_id} for ${contract.contract_id}`,
    );
    return contract;
  }

  async findContractByUID(
    contractId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding contract ${contractId}`);

    const contract = await tx.contracts.findFirst({
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

  async findContractByPublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding contract with publicId ${publicId}`);

    const contract = await tx.contracts.findFirst({
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

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Resolving contract publicId ${publicId}`);

    const contract = await tx.contracts.findFirst({
      where: {
        public_id: publicId,
      },
      select: {
        contract_id: true,
      },
    });

    if (!contract) {
      this.logger.warn(`Contract with publicId ${publicId} not found`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CONTRACT_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'Contract public ID cannot be resolved.',
      });
    }

    this.logger.log(
      `Contract publicId ${publicId} resolved: ${contract.contract_id}`,
    );

    return contract.contract_id;
  }

  async findContractByCampaignId(
    campaignId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding contract with campaignId ${campaignId}`);

    await this.campaignsService.findOneCampaign(campaignId, tx);

    const contract = await tx.contracts.findFirst({
      where: {
        campaign_id: campaignId,
      },
    });

    if (!contract) {
      this.logger.warn(`Contract with campaignid ${campaignId} not found`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'CONTRACT_NOT_FOUND',
        message: 'Contract not found',
      });
    }

    this.logger.log(`Found contract ${contract.contract_id}`);

    return contract;
  }

  async signContract(
    contractId: string,
    signerRole: UserRoles,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`${signerRole} Signing contract ${contractId}`);
    const contract = await this.findContractByUID(contractId, tx);

    this.handleContractConflicts(
      contractId,
      contract.client_signed,
      contract.creator_signed,
      signerRole,
    );

    const updatedContract = await tx.contracts.update({
      where: { contract_id: contract.contract_id },
      data:
        signerRole === UserRoles.CLIENT
          ? { client_signed: true }
          : { creator_signed: true },
    });

    if (updatedContract.client_signed && updatedContract.creator_signed) {
      await tx.contracts.update({
        where: { contract_id: contract.contract_id },
        data: { effective_date: new Date() },
      });
    }

    this.logger.log(`${signerRole} Signed contract ${contractId}`);
    return updatedContract;
  }

  handleContractConflicts(
    contractId: string,
    clientSigned: boolean,
    creatorSigned: boolean,
    signerRole: UserRoles,
  ) {
    if (!clientSigned && signerRole === UserRoles.CREATOR) {
      this.logger.warn(
        `Creator attempted to sign contract ${contractId} before client`,
      );

      throw new ForbiddenException({
        code: 'CLIENT_SIGNATURE_REQUIRED',
        message: 'The client must sign the contract before the creator.',
      });
    }

    if (clientSigned && creatorSigned) {
      this.logger.warn(`Contract ${contractId} is already signed.`);

      throw new ConflictException({
        code: 'CONTRACT_ALREADY_SIGNED',
        message: 'Contract is already signed by both client and creator',
      });
    }

    if (clientSigned && signerRole === UserRoles.CLIENT) {
      this.logger.warn(
        `Contract ${contractId} is already signed by the client.`,
      );

      throw new ConflictException({
        code: 'CONTRACT_ALREADY_SIGNED_BY_CLIENT',
        message: 'Contract is already signed by client.',
      });
    }
  }

  async updateContractDetails(
    contractId: string,
    dto: UpdateContractDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating contract ${contractId}`);

    await this.findContractByUID(contractId, tx);

    const updatedContract = await tx.contracts.update({
      where: { contract_id: contractId },
      data: {
        ...(dto.revision_policy !== undefined && {
          revision_policy: { ...dto.revision_policy },
        }),
        ...(dto.usage_rights !== undefined && {
          usage_rights: { ...dto.usage_rights },
        }),
        ...(dto.posting_requirements !== undefined && {
          posting_requirements: { ...dto.posting_requirements },
        }),
        ...(dto.exclusivity !== undefined && {
          exclusivity: { ...dto.exclusivity },
        }),
        ...(dto.expenses_purchases_terms !== undefined && {
          expenses_purchases_terms: { ...dto.expenses_purchases_terms },
        }),
        ...(dto.cancellation_period !== undefined && {
          cancellation_period: dto.cancellation_period,
        }),
        ...(dto.payment_terms !== undefined && {
          payment_terms: { ...dto.payment_terms },
        }),
        ...(dto.invoice_requirements !== undefined && {
          invoice_requirements: { ...dto.invoice_requirements },
        }),
        ...(dto.general_terms !== undefined && {
          general_terms: { ...dto.general_terms },
        }),
        ...(dto.extra_notes !== undefined && {
          extra_notes: dto.extra_notes,
        }),
      },
    });

    this.logger.log(`Contract ${contractId} updated successfully`);

    return updatedContract;
  }
}
