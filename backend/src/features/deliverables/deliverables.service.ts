import {
  ConflictException,
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
      `Creating deliverable ${dto.deliverableType} ${dto.deliverableContent} for campaign ${dto.campaignId}`,
    );

    const publicId = nanoid(10);

    const deliverable = await tx.deliverables.create({
      data: {
        public_id: publicId,
        campaign_id: dto.campaignId,
        quantity: dto.quantity,
        deliverable_type: dto.deliverableType,
        deliverable_content: dto.deliverableContent,
        requirements: dto.requirements,
        due_date: new Date(dto.dueDate),
        post_date: new Date(dto.postDate),
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

  async findOneDeliverableByUID(
    deliverableId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding deliverable with UID ${deliverableId}.`);

    const deliverable = await tx.deliverables.findFirst({
      where: {
        deliverable_id: deliverableId,
        is_deleted: false,
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
        is_deleted: false,
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
        is_deleted: false,
      },
      orderBy: {
        due_date: 'asc',
        post_date: 'asc',
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
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating deliverable ${deliverableId}`);

    await this.findOneDeliverableByUID(deliverableId, tx);

    const updatedDeliverable = await tx.deliverables.update({
      where: { deliverable_id: deliverableId },
      data: {
        ...(dto.quantity !== undefined && { quantity: dto.quantity }),
        ...(dto.deliverableType !== undefined && {
          deliverable_type: dto.deliverableType,
        }),
        ...(dto.deliverableContent !== undefined && {
          deliverable_content: dto.deliverableContent,
        }),
        ...(dto.requirements !== undefined && {
          requirements: dto.requirements,
        }),
        ...(dto.dueDate !== undefined && { due_date: new Date(dto.dueDate) }),
        ...(dto.postDate !== undefined && {
          post_date: new Date(dto.postDate),
        }),
        ...(dto.pricing !== undefined && {
          pricing: new Prisma.Decimal(dto.pricing),
        }),
      },
    });

    this.logger.log(`Deliverable ${deliverableId} updated successfully`);

    return updatedDeliverable;
  }

  async deleteDeliverable(
    deliverableId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Deleting deliverable ${deliverableId}`);

    const deliverable = await this.findOneDeliverableByUID(deliverableId, tx);

    if (deliverable.is_deleted) {
      this.logger.debug(
        `Deliverable ${deliverable.deliverable_id} is already deleted.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'DELIVERABLE_ALREADY_DELETED',
        message: 'Deliverable is already deleted',
      });
    }

    const deletedDeliverable = await tx.deliverables.update({
      where: { deliverable_id: deliverable.deliverable_id },
      data: {
        is_deleted: true,
      },
    });

    this.logger.log(
      `Sucessfully deleted deliverable ${deletedDeliverable.deliverable_id}`,
    );
    return deletedDeliverable;
  }
}
