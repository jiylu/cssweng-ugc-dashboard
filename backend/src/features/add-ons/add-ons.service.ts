import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateAddOnDTO } from './dto/create-add-on-dto';
import { Prisma } from '@prisma/client';
import { nanoid } from 'nanoid';
import { UpdateOptInDTO } from './dto/update-opt-in.dto';
import { UpdateAddOnDTO } from './dto/update-add-on.dto';

@Injectable()
export class AddOnsService {
  private readonly logger = new Logger(AddOnsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
  ) {}

  async createAddOn(
    dto: CreateAddOnDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Creating add-on ${dto.addOnName}`);

    const publicId = nanoid(10);

    const addOn = await tx.addOns.create({
      data: {
        campaign_id: dto.campaignId,
        public_id: publicId,
        add_on_name: dto.addOnName,
        description: dto.description,
        fee: dto.fee,
        initials: dto.initials,
      },
    });

    this.logger.log(
      `Created add-on ${addOn.add_on_name} with id ${addOn.add_on_id}`,
    );

    return addOn;
  }

  async createManyAddOns(
    campaignId: string,
    addOns: CreateAddOnDTO[],
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating ${addOns.length} add-ons for campaign ${addOns[0].campaignId}`,
    );

    await this.campaignsService.findOneCampaign(campaignId, tx);

    const createdAddOns = await Promise.all(
      addOns.map((a) => this.createAddOn(a, tx)),
    );

    this.logger.log(
      `Successfully created ${createdAddOns.length} add-ons for campaign ${createdAddOns[0].campaign_id}`,
    );

    return createdAddOns;
  }

  async findAddOnsForCampaign(campaignId: string) {
    this.logger.debug(`Finding add-ons for campaign ${campaignId}`);

    await this.campaignsService.findOneCampaign(campaignId);

    const addOns = await this.prisma.addOns.findMany({
      where: {
        campaign_id: campaignId,
        is_deleted: false,
      },
    });

    if (addOns.length === 0) {
      this.logger.debug(`No add-ons found for campaign ${campaignId}`);
      return null;
    }

    this.logger.debug(
      `${addOns.length} add-ons found for campaign ${campaignId}`,
    );

    return addOns;
  }

  async findOneAddOnByUID(
    addOnId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding add-on with UID ${addOnId}.`);

    const addOn = await tx.addOns.findFirst({
      where: {
        add_on_id: addOnId,
        is_deleted: false,
      },
    });

    if (!addOn) {
      this.logger.warn(`Add-on ${addOn} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'ADD_ON_NOT_FOUND',
        message: 'Add-on not found',
      });
    }

    this.logger.log(`Add-on ${addOn.add_on_id} found.`);

    return addOn;
  }

  async findOneAddOnByPublicId(publicId: string) {
    this.logger.debug(`Finding add-on with public id ${publicId}.`);

    const addOn = await this.prisma.addOns.findFirst({
      where: {
        public_id: publicId,
        is_deleted: false,
      },
    });

    if (!addOn) {
      this.logger.warn(`Add-on ${addOn} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'ADD_ON_NOT_FOUND',
        message: 'Add-on not found',
      });
    }

    this.logger.log(`Add-on ${addOn.add_on_id} found.`);

    return addOn;
  }

  async updateAddOnOptIn(addOnId: string, dto: UpdateOptInDTO) {
    this.logger.debug(`Updating opt in to ${dto.optIn} for ${addOnId}`);

    const oldAddOn = await this.findOneAddOnByUID(addOnId);

    const updatedAddOn = await this.prisma.addOns.update({
      where: {
        add_on_id: addOnId,
      },
      data: {
        opt_in: dto.optIn,
      },
    });

    this.logger.log(
      `AddOn ${oldAddOn.add_on_id} opt-in updated from ${oldAddOn.opt_in} to ${updatedAddOn.opt_in}`,
    );

    return updatedAddOn;
  }

  async updateAddOnDetails(
    addOnId: string,
    dto: UpdateAddOnDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating add-on ${addOnId}`);

    await this.findOneAddOnByUID(addOnId, tx);

    const updatedAddOn = await tx.addOns.update({
      where: { add_on_id: addOnId },
      data: {
        ...(dto.addOnName !== undefined && { add_on_name: dto.addOnName }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.fee !== undefined && { fee: dto.fee }),
        ...(dto.initials !== undefined && { initials: dto.initials }),
      },
    });

    this.logger.log(`Add-on ${addOnId} updated successfully`);

    return updatedAddOn;
  }

  async deleteAddOn(
    addOnId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Deleting add-on ${addOnId}`);

    const addOn = await this.findOneAddOnByUID(addOnId, tx);

    if (addOn.is_deleted) {
      this.logger.debug(
        `Add-on with id ${addOn.add_on_id} is already deleted.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'ADD-ON_ALREADY_DELETED',
        message: 'Add-on is already deleted',
      });
    }

    const deletedAddOn = await tx.addOns.update({
      where: { add_on_id: addOn.add_on_id },
      data: {
        is_deleted: true,
      },
    });

    this.logger.log(
      `Successfully deleted add-on with id ${deletedAddOn.add_on_id}`,
    );

    return deletedAddOn;
  }
}
