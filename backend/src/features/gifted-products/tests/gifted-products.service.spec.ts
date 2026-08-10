import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { GiftedProductsService } from '../gifted-products.service';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { CreateGiftedProductDTO } from '../dto/create-gifted-product.dto';
import { UpdateGiftedProductDTO } from '../dto/update-gifted-product.dto';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

describe('GiftedProductsService', () => {
  let service: GiftedProductsService;

  const mockPrisma = {
    giftedProducts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GiftedProductsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignService,
        } as any,
      ],
    }).compile();

    service = module.get<GiftedProductsService>(GiftedProductsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  // ── Shared test data helpers ──────────────────────────────────────

  const buildCreateGiftedProductDTO = (
    overrides?: Partial<CreateGiftedProductDTO>,
  ): CreateGiftedProductDTO => ({
    campaignId: 'camp-1',
    productName: 'Sample Skincare Set',
    value: 2500,
    shippingAddress: {
      delivery_address_line_1: '123 Creator St',
      delivery_address_line_2: 'Unit 7',
      country: 'Philippines',
      state_province: 'Metro Manila',
      city: 'Manila',
      zip_code: 1000,
    },
    deliveryInstructions: 'Ship within 5 business days',
    ownershipTerms: 'Creator keeps the product after the campaign ends',
    ...overrides,
  });

  const buildMockGiftedProduct = (
    dto: CreateGiftedProductDTO,
    id = 'gp-1',
  ) => ({
    gifted_product_id: id,
    campaign_id: dto.campaignId,
    product_name: dto.productName,
    value: dto.value,
    delivery_instructions: dto.deliveryInstructions,
    shipping_address: dto.shippingAddress,
    ownership_terms: dto.ownershipTerms,
  });

  // ── createGiftedProduct ───────────────────────────────────────────

  describe('createGiftedProduct', () => {
    it('should create a gifted product successfully', async () => {
      const dto = buildCreateGiftedProductDTO();
      const mockProduct = buildMockGiftedProduct(dto);

      mockPrisma.giftedProducts.create.mockResolvedValue(mockProduct);

      const res = await service.createGiftedProduct(dto);
      expect(res).toEqual(mockProduct);
      expect(mockPrisma.giftedProducts.create).toHaveBeenCalledWith({
        data: {
          campaign_id: dto.campaignId,
          public_id: 'mock-pb-id',
          product_name: dto.productName,
          value: dto.value,
          delivery_instructions: dto.deliveryInstructions,
          shipping_address: { ...dto.shippingAddress },
          ownership_terms: dto.ownershipTerms,
        },
      });
    });

    it('should reject on invalid inputs', async () => {
      const dto = buildCreateGiftedProductDTO();

      mockPrisma.giftedProducts.create.mockRejectedValue(
        new Error('Invalid input'),
      );

      await expect(service.createGiftedProduct(dto)).rejects.toThrow(
        'Invalid input',
      );
    });

    it('should use the provided transaction client', async () => {
      const dto = buildCreateGiftedProductDTO();
      const mockProduct = buildMockGiftedProduct(dto);

      const mockTx = {
        giftedProducts: {
          create: jest.fn().mockResolvedValue(mockProduct),
        },
      };

      const res = await service.createGiftedProduct(dto, mockTx as any);
      expect(res).toEqual(mockProduct);
      expect(mockTx.giftedProducts.create).toHaveBeenCalled();
      expect(mockPrisma.giftedProducts.create).not.toHaveBeenCalled();
    });
  });

  // ── createManyGiftedProducts ──────────────────────────────────────

  describe('createManyGiftedProducts', () => {
    it('should create one gifted product', async () => {
      const dtos: CreateGiftedProductDTO[] = [
        buildCreateGiftedProductDTO({ productName: 'Moisturizer' }),
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.giftedProducts.create.mockResolvedValueOnce(
        buildMockGiftedProduct(dtos[0], 'gp-1'),
      );

      const res = await service.createManyGiftedProducts('camp-1', dtos);
      expect(res).toHaveLength(1);
      expect(mockCampaignService.findOneCampaign).toHaveBeenCalledWith(
        'camp-1',
        mockPrisma,
      );
      expect(mockPrisma.giftedProducts.create).toHaveBeenCalledTimes(1);
    });

    it('should create two gifted products', async () => {
      const dtos: CreateGiftedProductDTO[] = [
        buildCreateGiftedProductDTO({ productName: 'Serum' }),
        buildCreateGiftedProductDTO({ productName: 'Toner', value: 1200 }),
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.giftedProducts.create
        .mockResolvedValueOnce(buildMockGiftedProduct(dtos[0], 'gp-1'))
        .mockResolvedValueOnce(buildMockGiftedProduct(dtos[1], 'gp-2'));

      const res = await service.createManyGiftedProducts('camp-1', dtos);
      expect(res).toHaveLength(2);
      expect(mockPrisma.giftedProducts.create).toHaveBeenCalledTimes(2);
    });

    it('should create three gifted products', async () => {
      const dtos: CreateGiftedProductDTO[] = [
        buildCreateGiftedProductDTO({ productName: 'Cleanser', value: 800 }),
        buildCreateGiftedProductDTO({ productName: 'Sunscreen', value: 950 }),
        buildCreateGiftedProductDTO({
          productName: 'Eye Cream',
          value: 1500,
        }),
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });
      mockPrisma.giftedProducts.create
        .mockResolvedValueOnce(buildMockGiftedProduct(dtos[0], 'gp-1'))
        .mockResolvedValueOnce(buildMockGiftedProduct(dtos[1], 'gp-2'))
        .mockResolvedValueOnce(buildMockGiftedProduct(dtos[2], 'gp-3'));

      const res = await service.createManyGiftedProducts('camp-1', dtos);
      expect(res).toHaveLength(3);
      expect(mockPrisma.giftedProducts.create).toHaveBeenCalledTimes(3);
    });

    it("should reject when campaign id doesn't exist", async () => {
      const dtos: CreateGiftedProductDTO[] = [
        buildCreateGiftedProductDTO({ campaignId: 'missing-camp' }),
      ];

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(
        service.createManyGiftedProducts('missing-camp', dtos),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should use the provided transaction client', async () => {
      const dtos: CreateGiftedProductDTO[] = [
        buildCreateGiftedProductDTO({ productName: 'Lip Balm' }),
      ];

      const mockTx = {
        giftedProducts: {
          create: jest
            .fn()
            .mockResolvedValue(buildMockGiftedProduct(dtos[0], 'gp-1')),
        },
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp-1',
      });

      const res = await service.createManyGiftedProducts(
        'camp-1',
        dtos,
        mockTx as any,
      );
      expect(res).toHaveLength(1);
      expect(mockTx.giftedProducts.create).toHaveBeenCalled();
      expect(mockPrisma.giftedProducts.create).not.toHaveBeenCalled();
    });
  });

  // ── findGiftedProductsForCampaign ─────────────────────────────────

  describe('findGiftedProductsForCampaign', () => {
    it('should return gifted products for a campaign', async () => {
      const campaignId = 'camp-1';
      const mockProducts = [
        buildMockGiftedProduct(
          buildCreateGiftedProductDTO({ productName: 'Serum' }),
          'gp-1',
        ),
        buildMockGiftedProduct(
          buildCreateGiftedProductDTO({ productName: 'Toner' }),
          'gp-2',
        ),
      ];

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.giftedProducts.findMany.mockResolvedValue(mockProducts);

      const res = await service.findGiftedProductsForCampaign(campaignId);
      expect(res).toEqual(mockProducts);
      expect(mockPrisma.giftedProducts.findMany).toHaveBeenCalledWith({
        where: { campaign_id: campaignId, is_deleted: false },
      });
    });

    it('should return null when no gifted products exist for the campaign', async () => {
      const campaignId = 'camp-1';

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: campaignId,
      });
      mockPrisma.giftedProducts.findMany.mockResolvedValue([]);

      const res = await service.findGiftedProductsForCampaign(campaignId);
      expect(res).toBeNull();
    });

    it('should throw NotFoundException when campaign id does not exist', async () => {
      const campaignId = 'missing-camp';
      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );
      await expect(
        service.findGiftedProductsForCampaign(campaignId),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ── findOneGiftedProduct ──────────────────────────────────────────

  describe('findOneGiftedProduct', () => {
    it('should return a gifted product when it exists', async () => {
      const mockProduct = buildMockGiftedProduct(
        buildCreateGiftedProductDTO(),
        'gp-1',
      );

      mockPrisma.giftedProducts.findFirst.mockResolvedValue(mockProduct);

      const res = await service.findOneGiftedProduct('gp-1');
      expect(res).toEqual(mockProduct);
      expect(mockPrisma.giftedProducts.findFirst).toHaveBeenCalledWith({
        where: { gifted_product_id: 'gp-1', is_deleted: false },
      });
    });

    it('should throw NotFoundException when gifted product does not exist', async () => {
      mockPrisma.giftedProducts.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneGiftedProduct('missing-gp'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  // ── resolvePublicId ───────────────────────────────────────────────

  describe('resolvePublicId', () => {
    it('should resolve a valid public ID', async () => {
      mockPrisma.giftedProducts.findFirst.mockResolvedValue({
        gifted_product_id: 'gp-1',
      });

      const res = await service.resolvePublicId('mock-pb-id');
      expect(res).toBe('gp-1');
      expect(mockPrisma.giftedProducts.findFirst).toHaveBeenCalledWith({
        where: { public_id: 'mock-pb-id', is_deleted: false },
        select: { gifted_product_id: true },
      });
    });

    it('should throw NotFoundException if public ID is not found', async () => {
      mockPrisma.giftedProducts.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId('invalid-pb')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  // ── updateGiftedProductDetails ───────────────────────────────────

  describe('updateGiftedProductDetails', () => {
    it('should update gifted product details successfully', async () => {
      const existingProduct = buildMockGiftedProduct(
        buildCreateGiftedProductDTO(),
        'gp-1',
      );
      const dto: UpdateGiftedProductDTO = {
        productName: 'Updated Skincare Set',
        value: 0,
        shippingAddress: {
          delivery_address_line_1: '456 Updated St',
          delivery_address_line_2: 'Floor 2',
          country: 'Philippines',
          state_province: 'Metro Manila',
          city: 'Manila',
          zip_code: 1001,
        },
        deliveryInstructions: 'Leave with building reception',
        ownershipTerms: 'Creator keeps the product permanently',
      };
      const updatedProduct = {
        ...existingProduct,
        product_name: dto.productName,
        value: dto.value,
        delivery_instructions: dto.deliveryInstructions,
        shipping_address: dto.shippingAddress,
        ownership_terms: dto.ownershipTerms,
      };

      mockPrisma.giftedProducts.findFirst.mockResolvedValue(existingProduct);
      mockPrisma.giftedProducts.update.mockResolvedValue(updatedProduct);

      const res = await service.updateGiftedProductDetails('gp-1', dto);

      expect(res).toEqual(updatedProduct);
      expect(mockPrisma.giftedProducts.findFirst).toHaveBeenCalledWith({
        where: { gifted_product_id: 'gp-1', is_deleted: false },
      });
      expect(mockPrisma.giftedProducts.update).toHaveBeenCalledWith({
        where: { gifted_product_id: 'gp-1' },
        data: {
          product_name: dto.productName,
          value: dto.value,
          delivery_instructions: dto.deliveryInstructions,
          shipping_address: { ...dto.shippingAddress },
          ownership_terms: dto.ownershipTerms,
        },
      });
    });

    it('should update only provided fields', async () => {
      const existingProduct = buildMockGiftedProduct(
        buildCreateGiftedProductDTO(),
        'gp-2',
      );
      const dto: UpdateGiftedProductDTO = {
        deliveryInstructions: 'Deliver after 6PM',
      };
      const updatedProduct = {
        ...existingProduct,
        delivery_instructions: dto.deliveryInstructions,
      };

      mockPrisma.giftedProducts.findFirst.mockResolvedValue(existingProduct);
      mockPrisma.giftedProducts.update.mockResolvedValue(updatedProduct);

      const res = await service.updateGiftedProductDetails('gp-2', dto);

      expect(res).toEqual(updatedProduct);
      expect(mockPrisma.giftedProducts.update).toHaveBeenCalledWith({
        where: { gifted_product_id: 'gp-2' },
        data: {
          delivery_instructions: dto.deliveryInstructions,
        },
      });
    });

    it('should throw NotFoundException when gifted product does not exist', async () => {
      mockPrisma.giftedProducts.findFirst.mockResolvedValue(null);

      await expect(
        service.updateGiftedProductDetails('missing-gp', {
          productName: 'Updated Skincare Set',
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.giftedProducts.update).not.toHaveBeenCalled();
    });
  });
});
