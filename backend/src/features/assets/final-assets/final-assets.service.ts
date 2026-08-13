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

@Injectable()
export class FinalAssetsService {
  private readonly logger = new Logger(FinalAssetsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
    private deliverablesService: DeliverablesService,
  ) {}

  async createFinalAssets(dto: CreateFinalAssetDTO) {
    this.logger.debug(
      `Creating final asset for deliverable ${dto.deliverableId}`,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const deliverable =
        await this.deliverablesService.findOneDeliverableByUID(
          dto.deliverableId,
          tx,
        );

      const campaign = await this.campaignsService.findOneCampaign(
        deliverable.campaign_id,
        tx,
      );

      if (!campaign.paid_full) {
        this.logger.warn(
          `Campaign ${campaign.campaign_id} is not fully paid, cannot create final asset.`,
        );

        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          code: 'CAMPAIGN_NOT_FULLY_PAID',
          message: 'Campaign must be fully paid before creating final assets.',
        });
      }

      return tx.finalAssets.create({
        data: {
          public_id: nanoid(10),
          deliverable_id: deliverable.deliverable_id,
          file_url: dto.fileUrl,
        },
      });
    });

    return result;
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

    const deliverables =
      await this.deliverablesService.findDeliverablesForCampaign(campaignId);

    const deliverableIds = deliverables.map(
      (deliverable) => deliverable.deliverable_id,
    );

    const finalAssets = await this.prisma.finalAssets.findMany({
      where: {
        deliverable_id: { in: deliverableIds },
      },
      orderBy: {
        created_at: 'desc',
      },
    });

    const groupedByDeliverable: Record<string, typeof finalAssets> = {};

    deliverables.forEach((deliverable) => {
      groupedByDeliverable[deliverable.public_id] = finalAssets.filter(
        (asset) => asset.deliverable_id === deliverable.deliverable_id,
      );
    });

    this.logger.log(
      `Found final assets for ${deliverables.length} deliverables of campaign ${campaignId}`,
    );

    return groupedByDeliverable;
  }
}
