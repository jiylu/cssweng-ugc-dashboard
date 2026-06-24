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
      `Creating deliverable ${dto.deliverableTitle} for campaign ${dto.campaignId}`,
    );

    const deliverable = await tx.deliverables.create({
      data: {
        campaign_id: dto.campaignId,
        deliverable_title: dto.deliverableTitle,
        description: dto.description,
        deadline: new Date(dto.deadline),
        pricing: new Prisma.Decimal(dto.pricing),
        deliverable_type: dto.deliverableType,
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

  async findOneDeliverable(deliverableId: string) {
    this.logger.debug(`Finding deliverable ${deliverableId}.`);

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

    this.logger.log(
      `Deliverable ${deliverable.deliverable_id} with title ${deliverable.deliverable_title} found.`,
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

    await this.findOneDeliverable(deliverableId);

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
