import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { DraftsService } from '../drafts.service';
import { UserService } from 'src/features/user/users/users.service';
import { CreateDraftDto } from '../dto/create-draft.dto';
import { NotFoundException } from '@nestjs/common';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'mock-public-id'),
}));

describe('DraftsService', () => {
  let service: DraftsService;

  const mockPrisma = {
    drafts: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockUserService = {
    getActiveUserById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DraftsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<DraftsService>(DraftsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createDraft', () => {
    it('should create a draft with all optional fields', async () => {
      const dto: CreateDraftDto = {
        userId: 'user-1',
        campaign: { projectName: 'Summer Campaign' },
        proposal: { notes: 'Draft proposal' },
        deliverables: [{ deliverableContent: 'Instagram Carousel' }],
        contract: { extra_notes: 'Draft contract' },
        addOns: [{ addOnName: 'Photography' }],
        giftedProducts: [{ productName: 'Tote Bag' }],
      };

      const mockUser = { user_id: 'user-1' };
      const mockDraft = {
        draft_id: 'draft-1',
        public_id: 'mock-public-id',
        user_id: 'user-1',
        campaign_content: dto.campaign,
        proposal_content: dto.proposal,
        deliverable_content: dto.deliverables,
        contract_content: dto.contract,
        add_ons_content: dto.addOns,
        gifted_products_content: dto.giftedProducts,
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.drafts.create.mockResolvedValue(mockDraft);

      const res = await service.createDraft(dto);

      expect(res).toEqual(mockDraft);
      expect(mockUserService.getActiveUserById).toHaveBeenCalledWith('user-1');
      expect(mockPrisma.drafts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-public-id',
          user_id: 'user-1',
          campaign_content: dto.campaign,
          proposal_content: dto.proposal,
          deliverable_content: dto.deliverables,
          add_ons_content: dto.addOns,
          gifted_products_content: dto.giftedProducts,
          contract_content: dto.contract,
        },
      });
    });

    it('should create a draft with only the campaign field', async () => {
      const dto: CreateDraftDto = {
        userId: 'user-1',
        campaign: { projectName: 'Winter Launch' },
      };

      const mockUser = { user_id: 'user-1' };
      const mockDraft = {
        draft_id: 'draft-2',
        public_id: 'mock-public-id',
        user_id: 'user-1',
        campaign_content: dto.campaign,
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.drafts.create.mockResolvedValue(mockDraft);

      const res = await service.createDraft(dto);

      expect(res).toEqual(mockDraft);
      expect(mockPrisma.drafts.create).toHaveBeenCalledWith({
        data: {
          public_id: 'mock-public-id',
          user_id: 'user-1',
          campaign_content: dto.campaign,
        },
      });
    });

    it('should throw NotFoundException when user does not exist', async () => {
      const dto: CreateDraftDto = {
        userId: 'missing-user',
        campaign: { projectName: 'Summer Campaign' },
      };

      mockUserService.getActiveUserById.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createDraft(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.drafts.create).not.toHaveBeenCalled();
    });
  });

  describe('resolvePublicId', () => {
    it('should return the draft_id for a valid publicId', async () => {
      const publicId = 'pub_valid_1';
      const mockResult = { draft_id: 'draft_internal_1' };

      mockPrisma.drafts.findFirst.mockResolvedValue(mockResult);

      const res = await service.resolvePublicId(publicId);

      expect(res).toBe('draft_internal_1');
      expect(mockPrisma.drafts.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId, is_deleted: false },
        select: { draft_id: true },
      });
    });

    it('should throw NotFoundException when no draft matches the publicId', async () => {
      const publicId = 'pub_missing';

      mockPrisma.drafts.findFirst.mockResolvedValue(null);

      await expect(service.resolvePublicId(publicId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.drafts.findFirst).toHaveBeenCalledWith({
        where: { public_id: publicId, is_deleted: false },
        select: { draft_id: true },
      });
    });

    it('should only select draft_id and not return the full draft object', async () => {
      const publicId = 'pub_select_check';

      mockPrisma.drafts.findFirst.mockResolvedValue({
        draft_id: 'draft_select_check',
      });

      const res = await service.resolvePublicId(publicId);

      expect(typeof res).toBe('string');
      expect(res).toBe('draft_select_check');
    });
  });

  describe('findOneDraft', () => {
    it('should return a draft when it exists', async () => {
      const mockDraft = {
        draft_id: 'draft-1',
        public_id: 'pub-1',
        user_id: 'user-1',
        campaign_content: { projectName: 'Summer Campaign' },
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };

      mockPrisma.drafts.findFirst.mockResolvedValue(mockDraft);

      const res = await service.findOneDraft('draft-1');

      expect(res).toEqual(mockDraft);
      expect(mockPrisma.drafts.findFirst).toHaveBeenCalledWith({
        where: { draft_id: 'draft-1', is_deleted: false },
      });
    });

    it('should throw NotFoundException when draft does not exist', async () => {
      mockPrisma.drafts.findFirst.mockResolvedValue(null);

      await expect(
        service.findOneDraft('missing-draft'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findDraftsForUser', () => {
    it('should return all drafts for an active user', async () => {
      const userId = '171005e9-10f1-4402-a655-7ef0e1ac1656';
      const mockUser = { user_id: userId };
      const mockDrafts = [
        {
          draft_id: 'draft-1',
          public_id: 'pub-1',
          user_id: userId,
          campaign_content: { projectName: 'Summer Campaign' },
          updated_at: new Date('2026-01-01T00:00:00Z'),
        },
        {
          draft_id: 'draft-2',
          public_id: 'pub-2',
          user_id: userId,
          proposal_content: { notes: 'Draft proposal' },
          updated_at: new Date('2026-01-02T00:00:00Z'),
        },
      ];

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.drafts.findMany.mockResolvedValue(mockDrafts);

      const res = await service.findDraftsForUser(userId);

      expect(res).toEqual(mockDrafts);
      expect(mockUserService.getActiveUserById).toHaveBeenCalledWith(userId);
      expect(mockPrisma.drafts.findMany).toHaveBeenCalledWith({
        where: { user_id: userId, is_deleted: false },
      });
    });

    it('should return an empty array when the user has no drafts', async () => {
      const userId = 'user-with-no-drafts';
      const mockUser = { user_id: userId };

      mockUserService.getActiveUserById.mockResolvedValue(mockUser);
      mockPrisma.drafts.findMany.mockResolvedValue([]);

      const res = await service.findDraftsForUser(userId);

      expect(res).toEqual([]);
      expect(mockPrisma.drafts.findMany).toHaveBeenCalledWith({
        where: { user_id: userId, is_deleted: false },
      });
    });

    it('should throw NotFoundException when the user does not exist', async () => {
      const userId = 'missing-user';

      mockUserService.getActiveUserById.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.findDraftsForUser(userId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.drafts.findMany).not.toHaveBeenCalled();
    });
  });

  describe('updateDraft', () => {
    it('should update only the provided fields', async () => {
      const existing = {
        draft_id: 'draft-1',
        public_id: 'pub-1',
        user_id: 'user-1',
        campaign_content: { projectName: 'Old Campaign' },
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };

      const dto = { campaign: { projectName: 'New Campaign' } };
      const updated = {
        ...existing,
        campaign_content: dto.campaign,
        updated_at: new Date('2026-01-02T00:00:00Z'),
      };

      mockPrisma.drafts.findFirst.mockResolvedValue(existing);
      mockPrisma.drafts.update.mockResolvedValue(updated);

      const res = await service.updateDraft('draft-1', dto);

      expect(res).toEqual(updated);
      expect(mockPrisma.drafts.update).toHaveBeenCalledWith({
        where: { draft_id: 'draft-1' },
        data: { campaign_content: dto.campaign, updated_at: expect.any(Date) },
      });
    });

    it('should update multiple fields', async () => {
      const existing = {
        draft_id: 'draft-2',
        public_id: 'pub-2',
        user_id: 'user-1',
        campaign_content: null,
        contract_content: null,
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };

      const dto = {
        campaign: { projectName: 'New Campaign' },
        contract: { extra_notes: 'New contract notes' },
      };
      const updated = {
        ...existing,
        campaign_content: dto.campaign,
        contract_content: dto.contract,
        updated_at: new Date('2026-01-02T00:00:00Z'),
      };

      mockPrisma.drafts.findFirst.mockResolvedValue(existing);
      mockPrisma.drafts.update.mockResolvedValue(updated);

      const res = await service.updateDraft('draft-2', dto);

      expect(res).toEqual(updated);
      expect(mockPrisma.drafts.update).toHaveBeenCalledWith({
        where: { draft_id: 'draft-2' },
        data: {
          campaign_content: dto.campaign,
          contract_content: dto.contract,
          updated_at: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException when draft does not exist', async () => {
      mockPrisma.drafts.findFirst.mockResolvedValue(null);

      await expect(
        service.updateDraft('missing-draft', { campaign: {} } as any),
      ).rejects.toBeInstanceOf(NotFoundException);
      expect(mockPrisma.drafts.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteDraft', () => {
    it('should soft delete a draft', async () => {
      const existing = {
        draft_id: 'draft-1',
        public_id: 'pub-1',
        user_id: 'user-1',
        updated_at: new Date('2026-01-01T00:00:00Z'),
      };
      const deleted = {
        ...existing,
        updated_at: new Date('2026-01-02T00:00:00Z'),
        is_deleted: true,
      };

      mockPrisma.drafts.findFirst.mockResolvedValue(existing);
      mockPrisma.drafts.update.mockResolvedValue(deleted);

      const res = await service.deleteDraft('draft-1');

      expect(res).toEqual(deleted);
      expect(mockPrisma.drafts.update).toHaveBeenCalledWith({
        where: { draft_id: 'draft-1' },
        data: { is_deleted: true },
      });
    });

    it('should throw NotFoundException when draft does not exist', async () => {
      mockPrisma.drafts.findFirst.mockResolvedValue(null);

      await expect(service.deleteDraft('missing-draft')).rejects.toBeInstanceOf(
        NotFoundException,
      );
      expect(mockPrisma.drafts.update).not.toHaveBeenCalled();
    });
  });
});
