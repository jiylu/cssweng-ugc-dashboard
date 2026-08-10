jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { ContractSignaturesService } from '../contract-signatures.service';
import { PrismaService } from 'src/shared/prisma/prisma.service';
import { ContractsService } from '../contracts.service';
import { UserRoles } from '@prisma/client';

describe('ContractSignaturesService', () => {
  let service: ContractSignaturesService;

  const mockPrismaService = {
    contractSignatures: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  const mockContractsService = {
    findContractByUID: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContractSignaturesService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
      ],
    }).compile();

    service = module.get<ContractSignaturesService>(ContractSignaturesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('storeSignature', () => {
    it('should store a signature successfully', async () => {
      const dto = {
        contractId: 'contract-123',
        signerRole: 'CLIENT' as UserRoles,
        signatureURL: 'http://example.com/sig.png',
        initialsURL: 'http://example.com/init.png',
      };

      const mockContract = {
        contract_id: 'contract-123',
      };

      const mockStoredSignature = {
        id: 'sig-123',
        contract_id: 'contract-123',
        signer_role: 'CLIENT',
        signature_url: 'http://example.com/sig.png',
        initials_url: 'http://example.com/init.png',
        signed_at: new Date(),
      };

      mockContractsService.findContractByUID.mockResolvedValue(mockContract);
      mockPrismaService.contractSignatures.create.mockResolvedValue(mockStoredSignature);

      const result = await service.storeSignature(dto);

      expect(result).toEqual(mockStoredSignature);
      expect(mockContractsService.findContractByUID).toHaveBeenCalledWith('contract-123');
      expect(mockPrismaService.contractSignatures.create).toHaveBeenCalledWith({
        data: {
          contract_id: 'contract-123',
          signer_role: 'CLIENT',
          signature_url: 'http://example.com/sig.png',
          initials_url: 'http://example.com/init.png',
          signed_at: expect.any(Date),
        },
      });
    });
  });

  describe('getSignatures', () => {
    it('should retrieve signatures for a contract', async () => {
      const contractId = 'contract-123';
      const mockContract = {
        contract_id: 'contract-123',
      };

      const mockSignatures = [
        {
          id: 'sig-1',
          contract_id: 'contract-123',
          signer_role: 'CLIENT',
        },
        {
          id: 'sig-2',
          contract_id: 'contract-123',
          signer_role: 'CREATOR',
        },
      ];

      mockContractsService.findContractByUID.mockResolvedValue(mockContract);
      mockPrismaService.contractSignatures.findMany.mockResolvedValue(mockSignatures);

      const result = await service.getSignatures(contractId);

      expect(result).toEqual(mockSignatures);
      expect(mockContractsService.findContractByUID).toHaveBeenCalledWith('contract-123');
      expect(mockPrismaService.contractSignatures.findMany).toHaveBeenCalledWith({
        where: {
          contract_id: 'contract-123',
        },
      });
    });
  });
});
