import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
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

  async createDeliverable(dto: CreateDeliverableDTO) {
    await this.campaignService.findOneCampaign(dto.campaignId);

    return await this.prisma.deliverables.create({
      data: {
        campaign_id: dto.campaignId,
        deliverable_title: dto.deliverableTitle,
        description: dto.description,
        deadline: new Date(dto.deadline),
        pricing: new Prisma.Decimal(dto.pricing),
        deliverable_type: dto.deliverableType,
      },
    });
  }

  async findOneDeliverable(deliverableId: string) {
    const deliverable = await this.prisma.deliverables.findFirst({
      where: {
        deliverable_id: deliverableId,
      },
    });

    if (!deliverable) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'DELIVERABLE_NOT_FOUND',
        message: 'Deliverable not found',
      });
    }

    return deliverable;
  }

  async findDeliverablesForCampaign(campaignId: string) {
    await this.campaignService.findOneCampaign(campaignId);

    return await this.prisma.deliverables.findMany({
      where: {
        campaign_id: campaignId,
      },
      orderBy: {
        deadline: 'asc',
      },
    });
  }

  async updateDeliverableDetails(
    deliverableId: string,
    dto: UpdateDeliverableDTO,
  ) {
    await this.findOneDeliverable(deliverableId);

    return await this.prisma.deliverables.update({
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
  }
}
