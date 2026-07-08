import { Injectable, Logger } from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { ProposalsService } from '../proposals/proposals.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ContractsService } from '../contracts/contracts.service';
import { AddOnsService } from '../add-ons/add-ons.service';
import { GiftedProductsService } from '../gifted-products/gifted-products.service';
import { EmailService } from '../email/email.service';
import { UpdateCampaignSetupDto } from './dto/update-campaign-setup.dto';

@Injectable()
export class CampaignSetupService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private deliverableService: DeliverablesService,
    private proposalService: ProposalsService,
    private contractService: ContractsService,
    private addOnService: AddOnsService,
    private giftedProductsService: GiftedProductsService,
    private emailService: EmailService,
  ) {}

  private readonly logger = new Logger(CampaignSetupService.name);

  async createFullCampaignService(dto: CreateCampaignRequestDto) {
    this.logger.debug(
      `Creating create campaign transaction for campaign ${dto.campaign.projectName} for user ${dto.campaign.ugcId}`,
    );

    const result = await this.prisma.$transaction(async (tx) => {
      const initialPrice = dto.deliverables.reduce(
        (sum, d) => sum + Number(d.pricing),
        0,
      );

      const totalPrice = initialPrice + initialPrice * (dto.campaign.tax / 100);

      const campaign = await this.campaignService.createCampaign(
        { ...dto.campaign, pricing: totalPrice },
        tx,
      );

      const [proposal, deliverables, contract, addOns, giftedProducts] =
        await Promise.all([
          this.proposalService.createProposal(
            { ...dto.proposal, campaignId: campaign.campaign_id },
            tx,
          ),
          this.deliverableService.createManyDeliverables(
            campaign.campaign_id,
            dto.deliverables.map((d) => ({
              ...d,
              campaignId: campaign.campaign_id,
            })),
            tx,
          ),
          this.contractService.createContract(
            { ...dto.contract, campaignId: campaign.campaign_id },
            tx,
          ),
          dto.addOns?.length
            ? this.addOnService.createManyAddOns(
                campaign.campaign_id,
                dto.addOns.map((a) => ({
                  ...a,
                  campaignId: campaign.campaign_id,
                })),
                tx,
              )
            : Promise.resolve([]),
          dto.giftedProducts?.length
            ? this.giftedProductsService.createManyGiftedProducts(
                campaign.campaign_id,
                dto.giftedProducts.map((g) => ({
                  ...g,
                  campaignId: campaign.campaign_id,
                })),
                tx,
              )
            : Promise.resolve([]),
        ]);

      return {
        campaign,
        proposal,
        deliverables,
        contract,
        addOns,
        giftedProducts,
      };
    });

    await this.emailService
      .sendProposalReminderEmail({
        clientEmail: dto.proposal.clientEmail,
        proposalPublicId: result.proposal.public_id,
        projectName: dto.campaign.projectName,
      })
      .catch((err) => {
        this.logger.warn('Failed to send proposal reminder email', err);
      });
    return result;
  }

  async updateCampaignSetup(campaignId: string, dto: UpdateCampaignSetupDto) {
    this.logger.debug(`Updating campaign setup for campaign ${campaignId}`);

    return this.prisma.$transaction(async (tx) => {
      await this.campaignService.findOneCampaign(campaignId, tx);

      const campaign = dto.campaign
        ? await this.campaignService.updateCampaignDetails(
            campaignId,
            dto.campaign,
            tx,
          )
        : null;

      const contract = dto.contract
        ? await this.contractService.updateContractDetails(
            dto.contract.contractId,
            dto.contract,
            tx,
          )
        : null;

      const createdDeliverables = dto.deliverables?.create?.length
        ? await this.deliverableService.createManyDeliverables(
            campaignId,
            dto.deliverables.create.map((deliverable) => ({
              ...deliverable,
              campaignId,
            })),
            tx,
          )
        : [];

      const updatedDeliverables = await Promise.all(
        dto.deliverables?.update?.map((deliverable) =>
          this.deliverableService.updateDeliverableDetails(
            deliverable.deliverableId,
            deliverable,
            tx,
          ),
        ) ?? [],
      );

      const deletedDeliverables = await Promise.all(
        dto.deliverables?.delete?.map((deliverableId) =>
          this.deliverableService.deleteDeliverable(deliverableId, tx),
        ) ?? [],
      );

      const createdGiftedProducts = dto.giftedProducts?.create?.length
        ? await this.giftedProductsService.createManyGiftedProducts(
            campaignId,
            dto.giftedProducts.create.map((giftedProduct) => ({
              ...giftedProduct,
              campaignId,
            })),
            tx,
          )
        : [];

      const updatedGiftedProducts = await Promise.all(
        dto.giftedProducts?.update?.map((giftedProduct) =>
          this.giftedProductsService.updateGiftedProductDetails(
            giftedProduct.giftedProductId,
            giftedProduct,
            tx,
          ),
        ) ?? [],
      );

      const deletedGiftedProducts = await Promise.all(
        dto.giftedProducts?.delete?.map((giftedProductId) =>
          this.giftedProductsService.deleteGiftedProduct(giftedProductId, tx),
        ) ?? [],
      );

      const createdAddOns = dto.addOns?.create?.length
        ? await this.addOnService.createManyAddOns(
            campaignId,
            dto.addOns.create.map((addOn) => ({
              ...addOn,
              campaignId,
            })),
            tx,
          )
        : [];

      const updatedAddOns = await Promise.all(
        dto.addOns?.update?.map((addOn) =>
          this.addOnService.updateAddOnDetails(addOn.addOnId, addOn, tx),
        ) ?? [],
      );

      const deletedAddOns = await Promise.all(
        dto.addOns?.delete?.map((addOnId) =>
          this.addOnService.deleteAddOn(addOnId, tx),
        ) ?? [],
      );

      return {
        campaign,
        contract,
        deliverables: {
          created: createdDeliverables,
          updated: updatedDeliverables,
          deleted: deletedDeliverables,
        },
        giftedProducts: {
          created: createdGiftedProducts,
          updated: updatedGiftedProducts,
          deleted: deletedGiftedProducts,
        },
        addOns: {
          created: createdAddOns,
          updated: updatedAddOns,
          deleted: deletedAddOns,
        },
      };
    });
  }
}
