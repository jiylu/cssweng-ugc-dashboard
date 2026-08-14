import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { MediaAssetDraftsService } from '../media-asset-drafts.service';
import { MediaAssetsService } from '../../media-assets/media-assets.service';
import { NotFoundException } from '@nestjs/common';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock-public-id'),
}));

describe('MediaAssetDraftsService', () => {
  let service: MediaAssetDraftsService;

  const mockPrisma = {
    mediaAssetsDrafts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  const mockMediaAssetsService = {
    resolvePublicId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaAssetDraftsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: MediaAssetsService,
          useValue: mockMediaAssetsService,
        },
      ],
    }).compile();

    service = module.get<MediaAssetDraftsService>(MediaAssetDraftsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDraft', () => {
    it('should create a media asset draft', async () => {
      const mockDraft = {
        media_asset_draft_id: 'draft-1',
        public_id: 'mock-public-id',
        media_asset_id: 'internal-media-1',
        content_url: 'http://example.com/file.jpg',
        created_at: expect.any(Date),
      };

      mockMediaAssetsService.resolvePublicId.mockResolvedValue('internal-media-1');
      mockPrisma.mediaAssetsDrafts.create.mockResolvedValue(mockDraft);

      const res = await service.createDraft('pub-media-1', 'http://example.com/file.jpg');

      expect(res).toEqual(mockDraft);
      expect(mockMediaAssetsService.resolvePublicId).toHaveBeenCalledWith('pub-media-1');
      expect(mockPrisma.mediaAssetsDrafts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-public-id',
          media_asset_id: 'internal-media-1',
          content_url: 'http://example.com/file.jpg',
          created_at: expect.any(Date),
        },
      });
    });
  });

  describe('resolvePublicId', () => {
    it('should return draft_id for valid publicId', async () => {
      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue({ media_asset_draft_id: 'internal-draft-1' });

      const res = await service.resolvePublicId('pub-valid');
      expect(res).toBe('internal-draft-1');
    });

    it('should throw NotFoundException when no draft matches', async () => {
      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId('pub-missing')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findOneDraft', () => {
    it('should return a draft', async () => {
      const mockDraft = { media_asset_draft_id: 'draft-1' };
      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue(mockDraft);

      const res = await service.findOneDraft('draft-1');
      expect(res).toEqual(mockDraft);
    });

    it('should throw NotFoundException if draft not found', async () => {
      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue(null);
      await expect(service.findOneDraft('draft-1')).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findDraftsForMediaAsset', () => {
    it('should return drafts for an asset', async () => {
      const mockDrafts = [{ media_asset_draft_id: 'draft-1' }];
      mockPrisma.mediaAssetsDrafts.findMany.mockResolvedValue(mockDrafts);

      const res = await service.findDraftsForMediaAsset('internal-media-1');
      expect(res).toEqual(mockDrafts);
    });
  });

  describe('updateDraft', () => {
    it('should update draft content_url', async () => {
      const existing = { media_asset_draft_id: 'draft-1', content_url: 'http://example.com/old.jpg' };
      const updated = { ...existing, content_url: 'http://example.com/new.jpg' };

      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue(existing);
      mockPrisma.mediaAssetsDrafts.update.mockResolvedValue(updated);

      const res = await service.updateDraft('draft-1', 'http://example.com/new.jpg');
      expect(res).toEqual(updated);
      expect(mockPrisma.mediaAssetsDrafts.update).toHaveBeenCalledWith({
        where: { media_asset_draft_id: 'draft-1' },
        data: { content_url: 'http://example.com/new.jpg', updated_at: expect.any(Date) },
      });
    });
  });

  describe('deleteDraft', () => {
    it('should delete a draft', async () => {
      const existing = { media_asset_draft_id: 'draft-1' };
      
      mockPrisma.mediaAssetsDrafts.findFirst.mockResolvedValue(existing);
      mockPrisma.mediaAssetsDrafts.delete.mockResolvedValue(existing);

      const res = await service.deleteDraft('draft-1');
      expect(res).toEqual(existing);
      expect(mockPrisma.mediaAssetsDrafts.delete).toHaveBeenCalledWith({
        where: { media_asset_draft_id: 'draft-1' },
      });
    });
  });
});
