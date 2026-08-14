import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { CampaignsService } from '../campaigns/campaigns.service';
import { DeliverablesService } from '../../deliverable/deliverables/deliverables.service';
import { ProposalsService } from '../proposals/proposals.service';
import { ProposalHistoryService } from '../proposals/proposal-history.service';
import { CreateCampaignRequestDto } from './dto/create-campaign-request-dto';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ContractsService } from '../contracts/contracts.service';
import { AddOnsService } from '../add-ons/add-ons.service';
import { GiftedProductsService } from '../gifted-products/gifted-products.service';
import { UpdateCampaignSetupDto } from './dto/update-campaign-setup.dto';
import { UserService } from '../../user/users/users.service';
import { PAYMENT_SCHEDULE } from '../contracts/dto/payment-terms.dto';
import { PaymentSchedule, ProposalStatus, UserRoles } from '@prisma/client';

@Injectable()
export class CampaignSetupService {
  constructor(
    private prisma: PrismaService,
    private campaignService: CampaignsService,
    private deliverableService: DeliverablesService,
    private proposalService: ProposalsService,
    private proposalHistoryService: ProposalHistoryService,
    private contractService: ContractsService,
    private addOnService: AddOnsService,
    private giftedProductsService: GiftedProductsService,
    private userService: UserService,
  ) {}

  private readonly logger = new Logger(CampaignSetupService.name);

  async createFullCampaignService(dto: CreateCampaignRequestDto) {
    this.logger.debug(
      `Creating create campaign transaction for campaign ${dto.campaign.projectName} for user ${dto.campaign.ugcId}`,
    );

    const user = await this.userService.findActiveUserByEmail(
      dto.proposal.clientEmail,
    );

    if (user?.role === UserRoles.CREATOR) {
      this.logger.warn(
        `Cannot use creator user ${user.user_id} as campaign client.`,
      );

      throw new ForbiddenException({
        status: HttpStatus.FORBIDDEN,
        code: 'USER_IS_NOT_CLIENT',
        message: 'User is not a client',
      });
    }

    let clientId: string | undefined = undefined;
    if (user) {
      clientId = user.user_id;
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const deliverablesTotal = dto.deliverables.reduce(
        (sum, d) => sum + Number(d.pricing),
        0,
      );

      const addOnsTotal = (dto.addOns ?? []).reduce(
        (sum, addOn) => sum + Number(addOn.fee),
        0,
      );

      const exclusivityTotal = dto.contract.exclusivity
        ? Number(dto.contract.exclusivity.exclusivity_fee)
        : 0;

      const giftedProductsTotal = (dto.giftedProducts ?? []).reduce(
        (sum, product) => sum + Number(product.value),
        0,
      );

      const subtotal =
        deliverablesTotal +
        addOnsTotal +
        exclusivityTotal +
        giftedProductsTotal;

      const totalPrice = subtotal + subtotal * (dto.campaign.tax / 100);

      const paymentSchedule =
        dto.contract.payment_terms.payment_schedule ===
        PAYMENT_SCHEDULE.DUE_FINAL_DELIVERY
          ? PaymentSchedule.DUE_FINAL_DELIVERY
          : PaymentSchedule.DEPOSIT_50_FINAL_50;

      const campaign = await this.campaignService.createCampaign(
        {
          ...dto.campaign,
          pricing: totalPrice,
          paymentSchedule: paymentSchedule,
          clientId: clientId,
        },
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

    await this.proposalHistoryService.createProposalHistory({
      proposalId: result.proposal.proposal_id,
      campaignContent: result.campaign,
      proposalContent: result.proposal,
      deliverableContent: result.deliverables,
      contractContent: result.contract,
      addOnsContent: result.addOns ?? [],
      giftedProductsContent: result.giftedProducts ?? [],
    });

    return result;
  }

  async getFullCampaignDetails(campaignId: string) {
    this.logger.debug(`Getting full campaign details for ${campaignId}`);
    const campaign = await this.campaignService.findOneCampaign(campaignId);

    return this.prisma.$transaction(async (tx) => {
      const [proposal, contract, deliverables, addOns, giftedProducts] =
        await Promise.all([
          this.proposalService.findProposalByCampaignId(
            campaign.campaign_id,
            false,
            tx,
          ),
          this.contractService.findContractByCampaignId(
            campaign.campaign_id,
            tx,
          ),
          this.deliverableService.findDeliverablesForCampaign(
            campaign.campaign_id,
            tx,
          ),
          this.addOnService.findAddOnsForCampaign(campaignId, tx),
          this.giftedProductsService.findGiftedProductsForCampaign(
            campaignId,
            tx,
          ),
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
  }

  async getFullCampaignDetailsByProposalPublicId(proposalPublicId: string) {
    const proposalId =
      await this.proposalService.resolvePublicId(proposalPublicId);
    const proposal = await this.proposalService.findActiveProposal(proposalId);
    const [details, latestHistory] = await Promise.all([
      this.getFullCampaignDetails(proposal.campaign_id),
      this.proposalHistoryService.findLatestVersion(proposal.proposal_id),
    ]);

    return {
      ...details,
      proposal: {
        ...details.proposal,
        client_comments: latestHistory.client_comments ?? '',
      },
    };
  }

  async updateCampaignSetup(campaignId: string, dto: UpdateCampaignSetupDto) {
    this.logger.debug(`Updating campaign setup for campaign ${campaignId}`);

    const result = await this.prisma.$transaction(async (tx) => {
      await this.campaignService.findOneCampaign(campaignId, tx);

      if (dto.campaign) {
        await this.campaignService.updateCampaignDetails(
          campaignId,
          dto.campaign,
          tx,
        );
      }

      const proposal = await this.proposalService.findProposalByCampaignId(
        campaignId,
        false,
        tx,
      );

      if (proposal.proposal_status !== ProposalStatus.PENDING) {
        await this.proposalService.updateProposalStatus(
          proposal.proposal_id,
          { proposalStatus: ProposalStatus.PENDING },
          tx,
        );
      }

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

      const currentCampaign = await this.campaignService.findOneCampaign(
        campaignId,
        tx,
      );

      const [campaignDeliverables, campaignAddOns] = await Promise.all([
        this.deliverableService.findDeliverablesForCampaign(campaignId, tx),
        this.addOnService.findAddOnsForCampaign(campaignId, tx),
      ]);

      const deliverablesTotal = campaignDeliverables.reduce(
        (sum, deliverable) => sum + deliverable.pricing.toNumber(),
        0,
      );

      const optedInAddOnsTotal = (campaignAddOns ?? [])
        .filter((addOn) => addOn.opt_in)
        .reduce((sum, addOn) => sum + addOn.fee.toNumber(), 0);

      const subtotal = deliverablesTotal + optedInAddOnsTotal;
      const totalPrice =
        subtotal + subtotal * (Number(currentCampaign.tax) / 100);

      const recomputedCampaign =
        await this.campaignService.updateCampaignDetails(
          campaignId,
          { pricing: totalPrice },
          tx,
        );

      return {
        campaign: recomputedCampaign,
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

    // Fetch the full current state after the update and snapshot it as a new proposal history version
    const fullDetails = await this.getFullCampaignDetails(campaignId);

    await this.proposalHistoryService.createProposalHistory({
      proposalId: fullDetails.proposal.proposal_id,
      campaignContent: fullDetails.campaign,
      proposalContent: fullDetails.proposal,
      deliverableContent: fullDetails.deliverables,
      contractContent: fullDetails.contract,
      addOnsContent: fullDetails.addOns ?? [],
      giftedProductsContent: fullDetails.giftedProducts ?? [],
    });

    return result;
  }
}
