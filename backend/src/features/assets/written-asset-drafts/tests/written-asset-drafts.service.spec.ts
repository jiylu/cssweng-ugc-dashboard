import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { WrittenAssetDraftsService } from '../written-asset-drafts.service';
import { WrittenAssetsService } from '../../written-assets/written-assets.service';
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

  const mockWrittenAssetsService = {
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
          provide: WrittenAssetsService,
          useValue: mockWrittenAssetsService,
        },
      ],
    }).compile();

    service = module.get<WrittenAssetDraftsService>(WrittenAssetDraftsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDraft', () => {
    it('should create a written asset draft', async () => {
      const dto: CreateWrittenAssetDraftDto = {
        writtenAssetPublicId: 'pub-written-1',
        content: 'Draft content',
      };

      const mockDraft = {
        written_asset_draft_id: 'draft-1',
        public_id: 'mock-public-id',
        written_asset_id: 'internal-written-1',
        content: dto.content,
        created_at: expect.any(Date),
      };

      mockWrittenAssetsService.resolvePublicId.mockResolvedValue(
        'internal-written-1',
      );
      mockPrisma.writtenAssetsDrafts.create.mockResolvedValue(mockDraft);

      const res = await service.createDraft(dto);

      expect(res).toEqual(mockDraft);
      expect(mockWrittenAssetsService.resolvePublicId).toHaveBeenCalledWith(
        'pub-written-1',
      );
      expect(mockPrisma.writtenAssetsDrafts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-public-id',
          written_asset_id: 'internal-written-1',
          content: dto.content,
          created_at: expect.any(Date),
        },
      });
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

  describe('findDraftsForWrittenAsset', () => {
    it('should return drafts for an asset', async () => {
      const mockDrafts = [{ written_asset_draft_id: 'draft-1' }];
      mockPrisma.writtenAssetsDrafts.findMany.mockResolvedValue(mockDrafts);

      const res = await service.findDraftsForWrittenAsset('internal-written-1');
      expect(res).toEqual(mockDrafts);
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
