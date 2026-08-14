import {
  ConflictException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { CampaignsService } from '../campaigns/campaigns.service';
import { CreateGiftedProductDTO } from './dto/create-gifted-product.dto';
import { Prisma } from '@prisma/client';
import { UpdateGiftedProductDTO } from './dto/update-gifted-product.dto';
import { nanoid } from 'nanoid';

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

    const publicId = nanoid(10);

    const giftedProduct = await tx.giftedProducts.create({
      data: {
        campaign_id: dto.campaignId,
        public_id: publicId,
        product_name: dto.productName,
        value: dto.value,
        delivery_instructions: dto.deliveryInstructions,
        shipping_address: { ...dto.shippingAddress },
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

  async findGiftedProductsForCampaign(
    campaignId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding gifted products for campaign ${campaignId}`);

    await this.campaignsService.findOneCampaign(campaignId, tx);

    const giftedProducts = await tx.giftedProducts.findMany({
      where: {
        campaign_id: campaignId,
        is_deleted: false,
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

  async findOneGiftedProduct(
    giftedProductId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Finding gifted product ${giftedProductId}`);

    const giftedProduct = await tx.giftedProducts.findFirst({
      where: {
        gifted_product_id: giftedProductId,
        is_deleted: false,
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
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Updating gifted product ${giftedProductId}`);

    await this.findOneGiftedProduct(giftedProductId, tx);

    const updatedGiftedProduct = await tx.giftedProducts.update({
      where: { gifted_product_id: giftedProductId },
      data: {
        ...(dto.productName !== undefined && {
          product_name: dto.productName,
        }),
        ...(dto.value !== undefined && { value: dto.value }),
        ...(dto.deliveryInstructions !== undefined && {
          delivery_instructions: dto.deliveryInstructions,
        }),
        ...(dto.shippingAddress !== undefined && {
          shipping_address: { ...dto.shippingAddress },
        }),
        ...(dto.ownershipTerms !== undefined && {
          ownership_terms: dto.ownershipTerms,
        }),
      },
    });

    this.logger.log(`Gifted product ${giftedProductId} updated successfully`);

    return updatedGiftedProduct;
  }

  async deleteGiftedProduct(
    giftedProductId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Deleting gifted product ${giftedProductId}`);

    const giftedProduct = await this.findOneGiftedProduct(giftedProductId, tx);

    if (giftedProduct.is_deleted) {
      this.logger.debug(
        `Gifted product ${giftedProduct.gifted_product_id} is already deleted.`,
      );

      throw new ConflictException({
        status: HttpStatus.CONFLICT,
        code: 'GIFTED_PRODUCT_ALREADY_DELETED',
        message: 'Gifted product is already deleted',
      });
    }

    const deletedGiftedProduct = await tx.giftedProducts.update({
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

  async resolvePublicId(
    publicId: string,
    tx: Prisma.TransactionClient | PrismaService = this.prisma,
  ) {
    this.logger.debug(`Resolving gifted product publicId ${publicId}`);

    const giftedProduct = await tx.giftedProducts.findFirst({
      where: {
        public_id: publicId,
        is_deleted: false,
      },
      select: {
        gifted_product_id: true,
      },
    });

    if (!giftedProduct) {
      this.logger.warn(
        `Gifted product with publicId ${publicId} not found or is deleted.`,
      );
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        code: 'GIFTED_PRODUCT_PUBLIC_ID_CANNOT_BE_RESOLVED',
        message: 'Gifted product public ID cannot be resolved.',
      });
    }

    this.logger.log(
      `Gifted product publicId ${publicId} resolved: ${giftedProduct.gifted_product_id}`,
    );

    return giftedProduct.gifted_product_id;
  }
}
