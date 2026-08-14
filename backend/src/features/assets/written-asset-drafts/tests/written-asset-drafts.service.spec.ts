import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { WrittenAssetDraftsService } from '../written-asset-drafts.service';
import { DeliverableItemsService } from '../../../deliverable/deliverable-items/deliverable-items.service';
import { CreateWrittenAssetDraftDto } from '../dto/create-written-asset-draft.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock-public-id'),
}));

describe('WrittenAssetDraftsService', () => {
  let service: WrittenAssetDraftsService;

  const mockPrisma = {
    writtenAssetsDrafts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockDeliverableItemsService = {
    resolvePublicId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WrittenAssetDraftsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: DeliverableItemsService,
          useValue: mockDeliverableItemsService,
        },
      ],
    }).compile();

    service = module.get<WrittenAssetDraftsService>(WrittenAssetDraftsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDraft', () => {
    it('should create a written asset draft when no draft exists', async () => {
      const dto: CreateWrittenAssetDraftDto = {
        deliverableItemPublicId: 'pub-item-1',
        content: 'Draft content',
      };

      const mockDraft = {
        written_asset_draft_id: 'draft-1',
        public_id: 'mock-public-id',
        deliverable_item_id: 'internal-item-1',
        content: dto.content,
        created_at: expect.any(Date),
      };

      mockDeliverableItemsService.resolvePublicId.mockResolvedValue(
        'internal-item-1',
      );
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(null);
      mockPrisma.writtenAssetsDrafts.create.mockResolvedValue(mockDraft);

      const res = await service.createDraft(dto);

      expect(res).toEqual(mockDraft);
      expect(mockDeliverableItemsService.resolvePublicId).toHaveBeenCalledWith(
        'pub-item-1',
      );
      expect(mockPrisma.writtenAssetsDrafts.findFirst).toHaveBeenCalledWith({
        where: {
          deliverable_item_id: 'internal-item-1',
        },
        orderBy: { updated_at: 'desc' },
      });
      expect(mockPrisma.writtenAssetsDrafts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-public-id',
          deliverable_item_id: 'internal-item-1',
          content: dto.content,
          created_at: expect.any(Date),
        },
      });
    });

    it('should update the existing draft when one exists', async () => {
      const dto: CreateWrittenAssetDraftDto = {
        deliverableItemPublicId: 'pub-item-1',
        content: 'New draft content',
      };

      const existing = {
        written_asset_draft_id: 'draft-1',
        public_id: 'mock-public-id',
        deliverable_item_id: 'internal-item-1',
        content: 'Old content',
      };

      const updated = { ...existing, content: dto.content };

      mockDeliverableItemsService.resolvePublicId.mockResolvedValue(
        'internal-item-1',
      );
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(existing);
      mockPrisma.writtenAssetsDrafts.update.mockResolvedValue(updated);

      const res = await service.createDraft(dto);

      expect(res).toEqual(updated);
      expect(mockPrisma.writtenAssetsDrafts.update).toHaveBeenCalledWith({
        where: { written_asset_draft_id: 'draft-1' },
        data: { content: dto.content, updated_at: expect.any(Date) },
      });
      expect(mockPrisma.writtenAssetsDrafts.create).not.toHaveBeenCalled();
    });
  });

  describe('resolvePublicId', () => {
    it('should return draft_id for valid publicId', async () => {
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue({
        written_asset_draft_id: 'internal-draft-1',
      });

      const res = await service.resolvePublicId('pub-valid');
      expect(res).toBe('internal-draft-1');
    });

    it('should throw NotFoundException when no draft matches', async () => {
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(null);

      await expect(
        service.resolvePublicId('pub-missing'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOneDraft', () => {
    it('should return a draft', async () => {
      const mockDraft = { written_asset_draft_id: 'draft-1' };
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(mockDraft);

      const res = await service.findOneDraft('draft-1');
      expect(res).toEqual(mockDraft);
    });

    it('should throw NotFoundException if draft not found', async () => {
      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(null);
      await expect(service.findOneDraft('draft-1')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('findDraftsForDeliverableItem', () => {
    it('should return drafts for a deliverable item', async () => {
      const mockDrafts = [{ written_asset_draft_id: 'draft-1' }];
      mockPrisma.writtenAssetsDrafts.findMany.mockResolvedValue(mockDrafts);

      const res = await service.findDraftsForDeliverableItem(
        'internal-item-1',
      );
      expect(res).toEqual(mockDrafts);
      expect(mockPrisma.writtenAssetsDrafts.findMany).toHaveBeenCalledWith({
        where: { deliverable_item_id: 'internal-item-1' },
        orderBy: { updated_at: 'desc' },
      });
    });
  });

  describe('updateDraft', () => {
    it('should update draft content', async () => {
      const existing = { written_asset_draft_id: 'draft-1', content: 'Old' };
      const updated = { ...existing, content: 'New' };

      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(existing);
      mockPrisma.writtenAssetsDrafts.update.mockResolvedValue(updated);

      const res = await service.updateDraft('draft-1', { content: 'New' });
      expect(res).toEqual(updated);
      expect(mockPrisma.writtenAssetsDrafts.update).toHaveBeenCalledWith({
        where: { written_asset_draft_id: 'draft-1' },
        data: { content: 'New', updated_at: expect.any(Date) },
      });
    });
  });

  describe('deleteDraft', () => {
    it('should delete a draft', async () => {
      const existing = { written_asset_draft_id: 'draft-1' };

      mockPrisma.writtenAssetsDrafts.findFirst.mockResolvedValue(existing);
      mockPrisma.writtenAssetsDrafts.delete.mockResolvedValue(existing);

      const res = await service.deleteDraft('draft-1');
      expect(res).toEqual(existing);
      expect(mockPrisma.writtenAssetsDrafts.delete).toHaveBeenCalledWith({
        where: { written_asset_draft_id: 'draft-1' },
      });
    });
  });
});
