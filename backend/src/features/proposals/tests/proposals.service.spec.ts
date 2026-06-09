import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProposalsService } from '../proposals.service';
import { ProposalStatus } from '@prisma/client';
import { CreateProposalDTO } from '../dto/create-proposal.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { UserService } from 'src/features/users/users.service';

describe('ProposalsService', () => {
  let service: ProposalsService;

  const mockPrisma = {
    proposals: {
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  };

  const mockCampaignService = {
    findOneCampaign: jest.fn(),
    findOneActiveCampaignByClientId: jest.fn(),
  };

  const mockUserService = {
    findActiveUserByEmail: jest.fn(),
  };

  beforeEach(async () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-06-06T16:35:51.366Z'));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProposalsService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<ProposalsService>(ProposalsService);
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('createProposal', () => {
    it('should create a proposal', async () => {
      const dto: CreateProposalDTO = {
        campaignId: 'camp123',
        clientEmail: 'client@test.com',
      };

      const createdProposal = {
        proposal_id: 'prop123',
        campaign_id: 'camp123',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
        created_at: new Date(),
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp123',
      });
      mockUserService.findActiveUserByEmail.mockResolvedValue(null);
      jest
        .spyOn(service, 'findActiveProposalByClientEmail')
        .mockResolvedValue(null);
      mockPrisma.proposals.create.mockResolvedValue(createdProposal);

      const res = await service.createProposal(dto);

      expect(res).toEqual(createdProposal);
      expect(mockPrisma.proposals.create).toHaveBeenCalledWith({
        data: {
          campaign_id: 'camp123',
          client_email: 'client@test.com',
        },
      });
    });

    it('should propagate NotFoundException when campaign does not exist', async () => {
      const dto: CreateProposalDTO = {
        campaignId: 'missing',
        clientEmail: 'client@test.com',
      };

      mockCampaignService.findOneCampaign.mockRejectedValue(
        new NotFoundException(),
      );

      await expect(service.createProposal(dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });

    it('should throw ConflictException when client has an existing active proposal without a user account', async () => {
      const dto: CreateProposalDTO = {
        campaignId: 'camp123',
        clientEmail: 'client@pending.com',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp123',
      });
      mockUserService.findActiveUserByEmail.mockResolvedValue(null);
      jest.spyOn(service, 'findActiveProposalByClientEmail').mockResolvedValue({
        proposal_id: 'prop-existing',
        campaign_id: 'camp123',
        client_email: 'client@pending.com',
        proposal_status: ProposalStatus.PENDING,
      } as any);

      await expect(service.createProposal(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });

    it('should throw ConflictException when client email maps to a user with an active campaign', async () => {
      const dto: CreateProposalDTO = {
        campaignId: 'camp123',
        clientEmail: 'client@active.com',
      };

      mockCampaignService.findOneCampaign.mockResolvedValue({
        campaign_id: 'camp123',
      });
      mockUserService.findActiveUserByEmail.mockResolvedValue({
        user_id: 'client-user-1',
      } as any);
      mockCampaignService.findOneActiveCampaignByClientId.mockResolvedValue({
        campaign_id: 'active-camp',
      } as any);

      await expect(service.createProposal(dto)).rejects.toBeInstanceOf(
        ConflictException,
      );
    });
  });

  describe('findActiveProposal', () => {
    it('should return active proposal when status is FOR_REVISION', async () => {
      const mockProposal = {
        proposal_id: 'prop-rev-1',
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.FOR_REVISION,
      };

      mockPrisma.proposals.findFirst.mockResolvedValueOnce(mockProposal);

      const res = await service.findActiveProposal('prop-rev-1');
      expect(res).toEqual(mockProposal);

      expect(mockPrisma.proposals.findFirst).toHaveBeenCalledWith({
        where: {
          proposal_id: 'prop-rev-1',
          OR: [
            { proposal_status: ProposalStatus.FOR_REVISION },
            { proposal_status: ProposalStatus.PENDING },
          ],
        },
      });
    });

    it('should return active proposal when status is PENDING', async () => {
      const mockProposal = {
        proposal_id: 'prop-pend-1',
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
      };

      mockPrisma.proposals.findFirst.mockResolvedValueOnce(mockProposal);

      const res = await service.findActiveProposal('prop-pend-1');
      expect(res).toEqual(mockProposal);
    });

    it('should throw NotFoundException when proposal is not active', async () => {
      mockPrisma.proposals.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.findActiveProposal('prop-missing'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('findActiveProposalByClientEmail', () => {
    it('should return one active proposal for a client', async () => {
      const mockProposal = {
        proposal_id: 'prop1',
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
      };

      mockPrisma.proposals.findFirst.mockResolvedValue(mockProposal);

      const res =
        await service.findActiveProposalByClientEmail('client@test.com');
      expect(res).toEqual(mockProposal);

      expect(mockPrisma.proposals.findFirst).toHaveBeenCalledWith({
        where: {
          client_email: 'client@test.com',
          OR: [
            { proposal_status: ProposalStatus.FOR_REVISION },
            { proposal_status: ProposalStatus.PENDING },
          ],
        },
      });
    });

    it('should return null when no active proposal for client', async () => {
      mockPrisma.proposals.findFirst.mockResolvedValue(null);
      const res =
        await service.findActiveProposalByClientEmail('client@test.com');
      expect(res).toBeNull();
    });
  });

  describe('findProposalByCampaignId', () => {
    it('should return a proposal for a given campaign id', async () => {
      const mockProposal = {
        proposal_id: 'prop-camp-1',
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
      };

      mockPrisma.proposals.findFirst.mockResolvedValueOnce(mockProposal);

      const res = await service.findProposalByCampaignId('camp1');
      expect(res).toEqual(mockProposal);

      expect(mockPrisma.proposals.findFirst).toHaveBeenCalledWith({
        where: { campaign_id: 'camp1' },
      });
    });

    it('should throw NotFoundException when no proposal for campaign', async () => {
      mockPrisma.proposals.findFirst.mockResolvedValueOnce(null);
      await expect(
        service.findProposalByCampaignId('missing-camp'),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateProposalComments', () => {
    it('should update comments when proposal is active', async () => {
      const proposalId = 'prop-update-1';
      const mockActive = {
        proposal_id: proposalId,
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
      };

      const dto = { comment: 'New comment' };

      jest
        .spyOn(service, 'findActiveProposal')
        .mockResolvedValue(mockActive as any);
      mockPrisma.proposals.update.mockResolvedValue({
        ...mockActive,
        client_comments: dto.comment,
      });

      const res = await service.updateProposalComments(proposalId, dto);
      expect(res).toEqual({ ...mockActive, client_comments: dto.comment });

      expect(mockPrisma.proposals.update).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        data: { client_comments: dto.comment },
      });
    });

    it('should throw NotFoundException when proposal is not active', async () => {
      const proposalId = 'prop-missing';
      jest
        .spyOn(service, 'findActiveProposal')
        .mockRejectedValue(new NotFoundException());
      await expect(
        service.updateProposalComments(proposalId, { comment: 'x' }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('updateProposalStatus', () => {
    it('should update proposal status successfully from PENDING to ACCEPTED', async () => {
      const proposalId = 'prop-update-status-1';
      const mockActive = {
        proposal_id: proposalId,
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.PENDING,
      };

      const dto = { proposalStatus: ProposalStatus.ACCEPTED };

      jest
        .spyOn(service, 'findActiveProposal')
        .mockResolvedValue(mockActive as any);
      mockPrisma.proposals.update.mockResolvedValue({
        ...mockActive,
        proposal_status: dto.proposalStatus,
      });

      const res = await service.updateProposalStatus(proposalId, dto);
      expect(res).toEqual({
        ...mockActive,
        proposal_status: dto.proposalStatus,
      });

      expect(mockPrisma.proposals.update).toHaveBeenCalledWith({
        where: { proposal_id: proposalId },
        data: { proposal_status: dto.proposalStatus },
      });
    });

    it('should throw NotFoundException when proposal not found', async () => {
      const proposalId = 'prop-notfound';
      jest
        .spyOn(service, 'findActiveProposal')
        .mockRejectedValue(new NotFoundException());
      await expect(
        service.updateProposalStatus(proposalId, {
          proposalStatus: ProposalStatus.ACCEPTED,
        }),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should throw ConflictException when trying to update an already ACCEPTED proposal', async () => {
      const proposalId = 'prop-accepted';
      const mockAccepted = {
        proposal_id: proposalId,
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.ACCEPTED,
      };

      jest
        .spyOn(service, 'findActiveProposal')
        .mockResolvedValue(mockAccepted as any);
      await expect(
        service.updateProposalStatus(proposalId, {
          proposalStatus: ProposalStatus.PENDING,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('should throw ConflictException when trying to update an already REJECTED proposal', async () => {
      const proposalId = 'prop-rejected';
      const mockRejected = {
        proposal_id: proposalId,
        campaign_id: 'camp1',
        client_email: 'client@test.com',
        proposal_status: ProposalStatus.REJECTED,
      };

      jest
        .spyOn(service, 'findActiveProposal')
        .mockResolvedValue(mockRejected as any);
      await expect(
        service.updateProposalStatus(proposalId, {
          proposalStatus: ProposalStatus.PENDING,
        }),
      ).rejects.toBeInstanceOf(ConflictException);
    });
  });
});
