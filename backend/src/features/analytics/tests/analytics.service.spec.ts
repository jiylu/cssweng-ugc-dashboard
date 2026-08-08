import { Test, TestingModule } from '@nestjs/testing';
import { CampaignStatus } from '@prisma/client';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { UserService } from 'src/features/users/users.service';
import { ProposalsService } from 'src/features/proposals/proposals.service';
import { AnalyticsService } from '../analytics.service';

jest.mock('nanoid', () => ({
  nanoid: jest.fn(() => 'test-id'),
}));

describe('AnalyticsService', () => {
  let service: AnalyticsService;

  const mockPrisma = {
    campaigns: {
      findMany: jest.fn(),
    },
  };

  const mockUserService = {
    getActiveUserById: jest.fn(),
  };

  const mockProposalService = {
    findProposalByCampaignId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AnalyticsService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: UserService, useValue: mockUserService },
        { provide: ProposalsService, useValue: mockProposalService },
      ],
    }).compile();

    service = module.get<AnalyticsService>(AnalyticsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('generateAnalyticsForUser', () => {
    it('should return active campaign and pending proposal counts', async () => {
      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: 'user-1',
      });
      mockPrisma.campaigns.findMany.mockResolvedValue([
        { campaign_id: 'camp-1' },
        { campaign_id: 'camp-2' },
      ]);
      mockProposalService.findProposalByCampaignId
        .mockResolvedValueOnce({ proposal_id: 'proposal-1' })
        .mockResolvedValueOnce({ proposal_id: 'proposal-2' });

      const result = await service.generateAnalyticsForUser('user-1');

      expect(result).toEqual({
        active_campaigns: 2,
        pending_proposals: 2,
        monthly_completed: 0,
        revenue_generated: 0,
      });
      expect(mockUserService.getActiveUserById).toHaveBeenCalledWith('user-1');
      expect(mockPrisma.campaigns.findMany).toHaveBeenCalledWith({
        where: {
          ugc_creator_id: 'user-1',
          campaign_status: CampaignStatus.ACTIVE,
        },
        select: {
          campaign_id: true,
        },
      });
      expect(
        mockProposalService.findProposalByCampaignId,
      ).toHaveBeenCalledTimes(2);
      expect(mockProposalService.findProposalByCampaignId).toHaveBeenCalledWith(
        'camp-1',
      );
      expect(mockProposalService.findProposalByCampaignId).toHaveBeenCalledWith(
        'camp-2',
      );
    });

    it('should return zero counts when the user has no active campaigns', async () => {
      mockUserService.getActiveUserById.mockResolvedValue({
        user_id: 'user-1',
      });
      mockPrisma.campaigns.findMany.mockResolvedValue([]);

      const result = await service.generateAnalyticsForUser('user-1');

      expect(result).toEqual({
        active_campaigns: 0,
        pending_proposals: 0,
        monthly_completed: 0,
        revenue_generated: 0,
      });
      expect(
        mockProposalService.findProposalByCampaignId,
      ).not.toHaveBeenCalled();
    });

    it('should propagate user lookup errors', async () => {
      mockUserService.getActiveUserById.mockRejectedValue(
        new Error('User not found'),
      );

      await expect(
        service.generateAnalyticsForUser('missing-user'),
      ).rejects.toThrow('User not found');
      expect(mockPrisma.campaigns.findMany).not.toHaveBeenCalled();
      expect(
        mockProposalService.findProposalByCampaignId,
      ).not.toHaveBeenCalled();
    });
  });
});
