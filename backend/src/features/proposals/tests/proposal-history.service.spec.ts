import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ProposalHistoryService } from '../proposal-history.service';
import { NotFoundException } from '@nestjs/common';
import { ProposalActions } from '@prisma/client';

describe('ProposalHistoryService', () => {
  let service: ProposalHistoryService;

  const mockPrisma = {
    proposalHistory: {
      create: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalHistoryService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ProposalHistoryService>(ProposalHistoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findLatestVersion', () => {
    const proposalId = 'proposal-1';

    const mockHistoryV1 = {
      history_id: 'history-1',
      proposal_id: proposalId,
      version_number: 1,
      campaign_content: { projectName: 'Campaign A' },
      proposal_content: { clientEmail: 'client@example.com' },
      deliverable_content: [{ type: 'UGC', quantity: 3 }],
      contract_content: { revisionPolicy: {} },
      add_ons_content: [{ addOnName: 'Rush delivery' }],
      gifted_products_content: [{ productName: 'Sample Kit' }],
      client_comments: '',
      action: ProposalActions.PENDING,
      created_at: new Date('2026-01-01T00:00:00Z'),
      updated_at: null,
    };

    const mockHistoryV3 = {
      history_id: 'history-3',
      proposal_id: proposalId,
      version_number: 3,
      campaign_content: { projectName: 'Campaign A v3' },
      proposal_content: { clientEmail: 'client@example.com' },
      deliverable_content: [{ type: 'UGC', quantity: 5 }],
      contract_content: { revisionPolicy: {} },
      add_ons_content: [{ addOnName: 'Rush delivery' }],
      gifted_products_content: [{ productName: 'Sample Kit' }],
      client_comments:
        'Looks good, minor changes needed on deliverables timeline.',
      action: ProposalActions.REVISE,
      created_at: new Date('2026-01-03T00:00:00Z'),
      updated_at: new Date('2026-01-04T00:00:00Z'),
    };

    it('should return the latest version for a proposal with multiple versions', async () => {
      mockPrisma.proposalHistory.findFirst.mockResolvedValue(mockHistoryV3);

      const res = await service.findLatestVersion(proposalId);

      expect(res).toEqual(mockHistoryV3);
      expect(res.version_number).toBe(3);
      expect(mockPrisma.proposalHistory.findFirst).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        orderBy: { version_number: 'desc' },
      });
    });

    it('should return the only version when a proposal has a single history entry', async () => {
      mockPrisma.proposalHistory.findFirst.mockResolvedValue(mockHistoryV1);

      const res = await service.findLatestVersion(proposalId);

      expect(res).toEqual(mockHistoryV1);
      expect(res.version_number).toBe(1);
      expect(mockPrisma.proposalHistory.findFirst).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        orderBy: { version_number: 'desc' },
      });
    });

    it('should throw NotFoundException when no history exists for the proposal', async () => {
      mockPrisma.proposalHistory.findFirst.mockResolvedValue(null);

      await expect(
        service.findLatestVersion('non-existent-proposal'),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockPrisma.proposalHistory.findFirst).toHaveBeenCalledWith({
        where: { proposal_id: 'non-existent-proposal' },
        orderBy: { version_number: 'desc' },
      });
    });
  });

  describe('findAllHistoryForProposal', () => {
    const proposalId = 'proposal-1';

    const mockHistoryV1 = {
      history_id: 'history-1',
      proposal_id: proposalId,
      version_number: 1,
      campaign_content: { projectName: 'Campaign A' },
      proposal_content: { clientEmail: 'client@example.com' },
      deliverable_content: [{ type: 'UGC', quantity: 3 }],
      contract_content: { revisionPolicy: {} },
      add_ons_content: [{ addOnName: 'Rush delivery' }],
      gifted_products_content: [{ productName: 'Sample Kit' }],
      client_comments: '',
      action: ProposalActions.PENDING,
      created_at: new Date('2026-01-01T00:00:00Z'),
      updated_at: null,
    };

    const mockHistoryV2 = {
      history_id: 'history-2',
      proposal_id: proposalId,
      version_number: 2,
      campaign_content: { projectName: 'Campaign A v2' },
      proposal_content: { clientEmail: 'client@example.com' },
      deliverable_content: [{ type: 'UGC', quantity: 4 }],
      contract_content: { revisionPolicy: {} },
      add_ons_content: [{ addOnName: 'Rush delivery' }],
      gifted_products_content: [{ productName: 'Sample Kit' }],
      client_comments: 'Please revise the deliverables section timeline.',
      action: ProposalActions.REVISE,
      created_at: new Date('2026-01-02T00:00:00Z'),
      updated_at: new Date('2026-01-02T12:00:00Z'),
    };

    const mockHistoryV3 = {
      history_id: 'history-3',
      proposal_id: proposalId,
      version_number: 3,
      campaign_content: { projectName: 'Campaign A v3' },
      proposal_content: { clientEmail: 'client@example.com' },
      deliverable_content: [{ type: 'UGC', quantity: 5 }],
      contract_content: { revisionPolicy: {} },
      add_ons_content: [{ addOnName: 'Rush delivery' }],
      gifted_products_content: [{ productName: 'Sample Kit' }],
      client_comments: '',
      action: ProposalActions.APPROVE,
      created_at: new Date('2026-01-03T00:00:00Z'),
      updated_at: null,
    };

    it('should return all history entries ordered by version_number ascending', async () => {
      const mockHistories = [mockHistoryV1, mockHistoryV2, mockHistoryV3];
      mockPrisma.proposalHistory.findMany.mockResolvedValue(mockHistories);

      const res = await service.findAllHistoryForProposal(proposalId);

      expect(res).toEqual(mockHistories);
      expect(res).toHaveLength(3);
      expect(res[0].version_number).toBe(1);
      expect(res[1].version_number).toBe(2);
      expect(res[2].version_number).toBe(3);
      expect(mockPrisma.proposalHistory.findMany).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        orderBy: { version_number: 'asc' },
      });
    });

    it('should return an empty array when no history exists for the proposal', async () => {
      mockPrisma.proposalHistory.findMany.mockResolvedValue([]);

      const res = await service.findAllHistoryForProposal(
        'non-existent-proposal',
      );

      expect(res).toEqual([]);
      expect(res).toHaveLength(0);
      expect(mockPrisma.proposalHistory.findMany).toHaveBeenCalledWith({
        where: { proposal_id: 'non-existent-proposal' },
        orderBy: { version_number: 'asc' },
      });
    });

    it('should return a single entry when only one history exists', async () => {
      mockPrisma.proposalHistory.findMany.mockResolvedValue([mockHistoryV1]);

      const res = await service.findAllHistoryForProposal(proposalId);

      expect(res).toEqual([mockHistoryV1]);
      expect(res).toHaveLength(1);
      expect(res[0].version_number).toBe(1);
      expect(mockPrisma.proposalHistory.findMany).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        orderBy: { version_number: 'asc' },
      });
    });
  });
});
