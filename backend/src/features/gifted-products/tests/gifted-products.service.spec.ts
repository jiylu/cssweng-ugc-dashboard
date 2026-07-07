import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { GiftedProductsService } from '../gifted-products.service';
import { NotFoundException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { CreateGiftedProductDTO } from '../dto/create-gifted-product.dto';

jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

describe('GiftedProductsService', () => {
  let service: GiftedProductsService;

  const mockPrisma = {
    giftedProducts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
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
    deliveryAddress: '123 Creator St, Manila',
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
    delivery_address: dto.deliveryAddress,
    delivery_instructions: dto.deliveryInstructions,
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
          product_name: dto.productName,
          value: dto.value,
          delivery_address: dto.deliveryAddress,
          delivery_instructions: dto.deliveryInstructions,
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
        where: { campaign_id: campaignId },
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
        where: { gifted_product_id: 'gp-1' },
      });
    });

    it('should throw NotFoundException when gifted product does not exist', async () => {
      mockPrisma.giftedProducts.findFirst.mockResolvedValue(null);
      await expect(
        service.findOneGiftedProduct('missing-gp'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
