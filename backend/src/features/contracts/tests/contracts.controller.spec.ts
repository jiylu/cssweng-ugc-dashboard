jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../contracts.controller';
import { ContractsService } from '../contracts.service';
import { UpdateContractDTO } from '../dto/update-contract.dto';
import { PAYMENT_SCHEDULE } from '../dto/payment-terms.dto';

describe('ContractsController', () => {
  let controller: ContractsController;

  const mockContractsService = {
    findContractByPublicId: jest.fn(),
    findContractByCampaignId: jest.fn(),
    signContract: jest.fn(),
    updateContractDetails: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContractsController],
      providers: [
        {
          provide: ContractsService,
          useValue: mockContractsService,
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
    mockContractsService.findContractByCampaignId.mockResolvedValue(contract);

    const res = await controller.findOneByCampaignId('camp-1');

    expect(res).toEqual(contract);
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
    mockContractsService.updateContractDetails.mockResolvedValue(updated);

    const res = await controller.update('contract-1', dto);

    expect(res).toEqual(updated);
    expect(mockContractsService.updateContractDetails).toHaveBeenCalledWith(
      'contract-1',
      dto,
    );
  });
});
