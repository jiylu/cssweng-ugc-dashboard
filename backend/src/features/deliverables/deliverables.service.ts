import {
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateDeliverableDTO } from './dto/create-deliverable.dto';
import { Prisma } from '@prisma/client';
import { UpdateDeliverableDTO } from './dto/update-deliverable.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class DeliverablesService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
  ) {}

  private readonly logger = new Logger(DeliverablesService.name);

  async createDeliverable(
    dto: CreateDeliverableDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating deliverable for campaign ${dto.campaignId} with quantity ${dto.quantity} deliverable type ${dto.deliverableType} for platform ${dto.platform} with format ${dto.format}`,
    );

    const publicId = nanoid(10);

    const deliverable = await tx.deliverables.create({
      data: {
        public_id: publicId,
        campaign_id: dto.campaignId,
        quantity: dto.quantity,
        deliverable_type: dto.deliverableType,
        platform: dto.platform,
        format: dto.format,
        description: dto.description,
        deadline: new Date(dto.deadline),
        pricing: new Prisma.Decimal(dto.pricing),
      },
    });

    this.logger.log(
      `Deliverable ${deliverable.deliverable_id} created for campaign ${deliverable.campaign_id}`,
    );

    return deliverable;
  }

  async createManyDeliverables(
    campaignId: string,
    deliverables: CreateDeliverableDTO[],
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating ${deliverables.length} deliverables for ${campaignId}`,
    );

    await this.campaignService.findOneCampaign(campaignId, tx);
    const createdDeliverables = await Promise.all(
      deliverables.map((d) => this.createDeliverable(d, tx)),
    );

    this.logger.log(
      `Successfully created ${createdDeliverables.length} deliverables for campaign ${campaignId}`,
    );

    return createdDeliverables;
  }

  async findOneDeliverableByUID(deliverableId: string) {
    this.logger.debug(`Finding deliverable with UID ${deliverableId}.`);

    const deliverable = await this.prisma.deliverables.findFirst({
      where: {
        deliverable_id: deliverableId,
      },
    });

    if (!deliverable) {
      this.logger.warn(`Deliverable ${deliverableId} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'DELIVERABLE_NOT_FOUND',
        message: 'Deliverable not found',
      });
    }

    this.logger.log(`Deliverable ${deliverable.deliverable_id} found.`);

    return deliverable;
  }

  async findOneDeliverableByPublicId(publicId: string) {
    this.logger.debug(`Finding deliverable with public Id ${publicId}`);

    const deliverable = await this.prisma.deliverables.findFirst({
      where: {
        public_id: publicId,
      },
    });

    if (!deliverable) {
      this.logger.warn(`Deliverable with publicId ${publicId} not found.`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'DELIVERABLE_NOT_FOUND',
        message: 'Deliverable not found',
      });
    }

    this.logger.log(
      `Deliverable ${deliverable.deliverable_id} found with public id ${deliverable.public_id}.`,
    );

    return deliverable;
  }

  async findDeliverablesForCampaign(campaignId: string) {
    this.logger.debug(`Finding deliverables for campaign ${campaignId}`);

    await this.campaignService.findOneCampaign(campaignId);

    const campaignDeliverables = await this.prisma.deliverables.findMany({
      where: {
        campaign_id: campaignId,
      },
      orderBy: {
        deadline: 'asc',
      },
    });

    this.logger.debug(
      `Successfully found ${campaignDeliverables.length} deliverables for campaign ${campaignId}.`,
    );

    return campaignDeliverables;
  }

  async updateDeliverableDetails(
    deliverableId: string,
    dto: UpdateDeliverableDTO,
  ) {
    this.logger.debug(`Updating deliverable ${deliverableId}`);

    await this.findOneDeliverableByUID(deliverableId);

    const updatedDeliverable = await this.prisma.deliverables.update({
      where: { deliverable_id: deliverableId },
      data: {
        ...(dto.deliverableTitle && {
          deliverable_title: dto.deliverableTitle,
        }),
        ...(dto.description && { description: dto.description }),
        ...(dto.deadline && { deadline: new Date(dto.deadline) }),
        ...(dto.pricing && { pricing: new Prisma.Decimal(dto.pricing) }),
        ...(dto.deliverableType && { deliverable_type: dto.deliverableType }),
      },
    });

    this.logger.log(`Deliverable ${deliverableId} updated successfully`);

    return updatedDeliverable;
  }
}
