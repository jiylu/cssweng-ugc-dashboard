import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { DeliverablesService } from 'src/features/deliverables/deliverables.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CreateFinalAssetDTO } from './dto/create-final-asset.dto';
import { nanoid } from 'nanoid';
import { Prisma } from '@prisma/client';

@Injectable()
export class FinalAssetsService {
  private readonly logger = new Logger(FinalAssetsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
    private deliverablesService: DeliverablesService,
  ) {}

  async createFinalAssets(
    dto: CreateFinalAssetDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating final asset for deliverable ${dto.deliverableId}`,
    );

    const deliverable = await this.deliverablesService.findOneDeliverableByUID(
      dto.deliverableId,
      tx,
    );

    const finalAsset = tx.finalAssets.create({
      data: {
        public_id: nanoid(10),
        deliverable_id: deliverable.deliverable_id,
        file_url: dto.fileUrl,
      },
    });

    return finalAsset;
  }

  async findFinalAssetsForDeliverable(deliverableId: string) {
    this.logger.debug(`Finding final assets for deliverable ${deliverableId}`);

    const deliverable =
      await this.deliverablesService.findOneDeliverableByUID(deliverableId);

    const finalAssets = await this.prisma.finalAssets.findMany({
      where: {
        deliverable_id: deliverable.deliverable_id,
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    this.logger.log(
      `Found ${finalAssets.length} final assets for deliverable ${deliverableId}`,
    );

    return finalAssets;
  }

  async findFinalAssetsForCampaign(campaignId: string) {
    this.logger.debug(`Finding final assets for campaign ${campaignId}`);

    const result = await this.prisma.$transaction(async (tx) => {
      const deliverables =
        await this.deliverablesService.findDeliverablesForCampaign(
          campaignId,
          tx,
        );

      const campaign = await this.campaignsService.findOneCampaign(
        campaignId,
        tx,
      );

      if (!campaign.paid_full) {
        this.logger.warn(
          `Campaign ${campaign.campaign_id} is not fully paid, cannot view final asset.`,
        );

        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          code: 'CAMPAIGN_NOT_FULLY_PAID',
          message: 'Campaign must be fully paid before viewing final assets.',
        });
      }

      const deliverableIds = deliverables.map(
        (deliverable) => deliverable.deliverable_id,
      );

      const finalAssets = await tx.finalAssets.findMany({
        where: {
          deliverable_id: { in: deliverableIds },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      const groupedByDeliverable: Record<
        string,
        { deliverablePublicId: string; finalAssets: typeof finalAssets }
      > = {};

      deliverables.forEach((deliverable, index) => {
        const label = `deliverable_${index + 1}`;

        groupedByDeliverable[label] = {
          deliverablePublicId: deliverable.public_id,
          finalAssets: finalAssets.filter(
            (asset) => asset.deliverable_id === deliverable.deliverable_id,
          ),
        };
      });

      this.logger.log(
        `Found final assets for ${deliverables.length} deliverables of campaign ${campaignId}`,
      );

      return groupedByDeliverable;
    });

    return result;
  }
}
