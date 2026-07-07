import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateGiftedProductDTO } from './dto/create-gifted-product.dto';
import { Prisma } from '@prisma/client';
import { UpdateGiftedProductDTO } from './dto/update-gifted-product.dto';

@Injectable()
export class GiftedProductsService {
  private readonly logger = new Logger(GiftedProductsService.name);
  constructor(
    private prisma: PrismaService,
    private campaignsService: CampaignsService,
  ) {}

  async createGiftedProduct(
    dto: CreateGiftedProductDTO,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Creating gifted product ${dto.productName}`);

    const giftedProduct = await tx.giftedProducts.create({
      data: {
        campaign_id: dto.campaignId,
        product_name: dto.productName,
        value: dto.value,
        delivery_address: dto.deliveryAddress,
        delivery_instructions: dto.deliveryInstructions,
        ownership_terms: dto.ownershipTerms,
      },
    });

    this.logger.log(
      `Created gifted product ${giftedProduct.product_name} with id ${giftedProduct.gifted_product_id}`,
    );

    return giftedProduct;
  }

  async createManyGiftedProducts(
    campaignId: string,
    giftedProducts: CreateGiftedProductDTO[],
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(
      `Creating ${giftedProducts.length} gifted products for campaign ${giftedProducts[0].campaignId}`,
    );

    await this.campaignsService.findOneCampaign(campaignId, tx);

    const createdGiftedProducts = await Promise.all(
      giftedProducts.map((g) => this.createGiftedProduct(g, tx)),
    );

    this.logger.log(
      `Successfully created ${createdGiftedProducts.length} gifted products for campaign ${createdGiftedProducts[0].campaign_id}`,
    );

    return createdGiftedProducts;
  }

  async findGiftedProductsForCampaign(campaignId: string) {
    this.logger.debug(`Finding gifted products for campaign ${campaignId}`);

    await this.campaignsService.findOneCampaign(campaignId);

    const giftedProducts = await this.prisma.giftedProducts.findMany({
      where: {
        campaign_id: campaignId,
      },
    });

    if (giftedProducts.length === 0) {
      this.logger.debug(`No gifted products for campaign ${campaignId}`);
      return null;
    }

    this.logger.debug(
      `${giftedProducts.length} gifted products found for campaign ${campaignId}`,
    );

    return giftedProducts;
  }

  async findOneGiftedProduct(giftedProductId: string) {
    this.logger.debug(`Finding gifted product ${giftedProductId}`);

    const giftedProduct = await this.prisma.giftedProducts.findFirst({
      where: {
        gifted_product_id: giftedProductId,
      },
    });

    if (!giftedProduct) {
      this.logger.warn(`Gifted product ${giftedProductId} not found`);
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'GIFTED_PRODUCT_NOT_FOUND',
        message: 'Gifted product not found',
      });
    }

    this.logger.log(`Gifted product ${giftedProduct.gifted_product_id} found.`);
    return giftedProduct;
  }

  async updateGiftedProductDetails(
    giftedProductId: string,
    dto: UpdateGiftedProductDTO,
  ) {
    this.logger.debug(`Updating gifted product ${giftedProductId}`);

    await this.findOneGiftedProduct(giftedProductId);

    const updatedGiftedProduct = await this.prisma.giftedProducts.update({
      where: { gifted_product_id: giftedProductId },
      data: {
        ...(dto.productName !== undefined && {
          product_name: dto.productName,
        }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.deliveryAddress !== undefined && {
          delivery_address: dto.deliveryAddress,
        }),
        ...(dto.deliveryInstructions !== undefined && {
          delivery_instructions: dto.deliveryInstructions,
        }),
        ...(dto.ownershipTerms !== undefined && {
          ownership_terms: dto.ownershipTerms,
        }),
      },
    });

    this.logger.log(`Gifted product ${giftedProductId} updated successfully`);

    return updatedGiftedProduct;
  }

  async deleteGiftedProduct(giftedProductId: string) {
    this.logger.debug(`Deleting gifted product ${giftedProductId}`);

    const giftedProduct = await this.findOneGiftedProduct(giftedProductId);

    if (giftedProduct.is_deleted) {
      this.logger.debug(
        `Gifted product ${giftedProduct.gifted_product_id} is already deleted.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'DELIVERABLE_ALREADY_DELETED',
        message: 'Deliverable is already deleted',
      });
    }

    const deletedGiftedProduct = await this.prisma.giftedProducts.update({
      where: { gifted_product_id: giftedProduct.gifted_product_id },
      data: {
        is_deleted: true,
      },
    });

    this.logger.log(
      `Successfully deleted gifted product ${deletedGiftedProduct.gifted_product_id}`,
    );

    return deletedGiftedProduct;
  }
}
