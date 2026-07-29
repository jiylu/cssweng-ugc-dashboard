jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../contracts.controller';
import { ContractsService } from '../contracts.service';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { UpdateContractDTO } from '../dto/update-contract.dto';
import { PAYMENT_SCHEDULE } from '../dto/payment-terms.dto';

describe('ContractsController', () => {
  let controller: ContractsController;

  const mockContractsService = {
    findContractByUID: jest.fn(),
    findContractByCampaignId: jest.fn(),
    signContract: jest.fn(),
    updateContractDetails: jest.fn(),
    resolvePublicId: jest.fn(),
  };

  const mockCampaignsService = {
    resolveCampaignPublicId: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
        },
        {
          provide: CampaignsService,
          useValue: mockCampaignsService,
        },
      ],
    }).compile();

    controller = module.get<ContractsController>(ContractsController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should route campaign lookup to the service', async () => {
    const contract = {
      contract_id: 'contract-1',
      campaign_id: 'camp-1',
    };
    mockCampaignsService.resolveCampaignPublicId.mockResolvedValue('camp-1');
    mockContractsService.findContractByCampaignId.mockResolvedValue(contract);

    const res = await controller.findOneByCampaignId('pub-camp-1');

    expect(res).toBeDefined();
    expect(res.campaign_id).toBeUndefined();
    expect(res.contract_id).toBeUndefined();
    expect(mockCampaignsService.resolveCampaignPublicId).toHaveBeenCalledWith(
      'pub-camp-1',
    );
    expect(mockContractsService.findContractByCampaignId).toHaveBeenCalledWith(
      'camp-1',
    );
  });

  it('should route contract update to the service', async () => {
    const dto: UpdateContractDTO = {
      cancellation_period: 14,
      payment_terms: {
        payment_schedule: PAYMENT_SCHEDULE.NET_15,
        payment_method: 'GCash',
      },
    };
    const updated = { contract_id: 'contract-1', ...dto };
    mockContractsService.resolvePublicId.mockResolvedValue('contract-1');
    mockContractsService.updateContractDetails.mockResolvedValue(updated);

    const res = await controller.update('pub-contract-1', dto);

    expect(res).toBeDefined();
    expect(res.cancellation_period).toBe(14);
    expect(res.contract_id).toBeUndefined();
    expect(mockContractsService.resolvePublicId).toHaveBeenCalledWith(
      'pub-contract-1',
    );
    expect(mockContractsService.updateContractDetails).toHaveBeenCalledWith(
      'contract-1',
      dto,
    );
  });
});
