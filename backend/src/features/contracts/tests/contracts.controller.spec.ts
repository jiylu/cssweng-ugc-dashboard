jest.mock('nanoid', () => ({ nanoid: jest.fn(() => 'mock-pb-id') }));

import { Test, TestingModule } from '@nestjs/testing';
import { ContractsController } from '../contracts.controller';
import { ContractsService } from '../contracts.service';
import { CampaignsService } from 'src/features/campaigns/campaigns.service';
import { NotificationsService } from 'src/features/notifications/notifications.service';
import { UpdateContractDTO } from '../dto/update-contract.dto';
import { SignContractDTO } from '../dto/sign-contract.dto';
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
    findOneCampaign: jest.fn(),
  };

  const mockNotificationsService = {
    createNotification: jest.fn(),
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
        {
          provide: NotificationsService,
          useValue: mockNotificationsService,
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
    const campaign = {
      campaign_id: 'camp-1',
      ugc_creator_id: 'creator-1',
      project_name: 'Test Project',
    };
    mockCampaignsService.resolveCampaignPublicId.mockResolvedValue('camp-1');
    mockCampaignsService.findOneCampaign.mockResolvedValue(campaign);
    mockContractsService.findContractByCampaignId.mockResolvedValue(contract);

    const res = await controller.findOneByCampaignId('pub-camp-1');

    expect(res).toBeDefined();
    expect(res.campaign_id).toBeUndefined();
    expect(res.contract_id).toBeUndefined();
    expect(mockCampaignsService.resolveCampaignPublicId).toHaveBeenCalledWith(
      'pub-camp-1',
    );
    expect(mockCampaignsService.findOneCampaign).toHaveBeenCalledWith('camp-1');
    expect(mockNotificationsService.createNotification).not.toHaveBeenCalled();
    expect(mockContractsService.findContractByCampaignId).toHaveBeenCalledWith(
      'camp-1',
    );
  });

  it('should notify the creator when a contract is signed', async () => {
    const contract = {
      contract_id: 'contract-1',
      campaign_id: 'camp-1',
    };
    const campaign = {
      campaign_id: 'camp-1',
      ugc_creator_id: 'creator-1',
      project_name: 'Test Project',
    };
    const dto: SignContractDTO = {
      firstName: 'Jane',
      lastName: 'Doe',
      signatureDataUrl: 'data:image/png;base64,...',
      initialsDataUrl: 'data:image/png;base64,...',
    };
    mockContractsService.resolvePublicId.mockResolvedValue('contract-1');
    mockContractsService.signContract.mockResolvedValue(contract);
    mockCampaignsService.findOneCampaign.mockResolvedValue(campaign);
    mockNotificationsService.createNotification.mockResolvedValue(undefined);

    const res = await controller.sign('pub-contract-1', dto);

    expect(res).toBeDefined();
    expect(mockContractsService.resolvePublicId).toHaveBeenCalledWith(
      'pub-contract-1',
    );
    expect(mockContractsService.signContract).toHaveBeenCalledWith(
      'contract-1',
      dto,
    );
    expect(mockCampaignsService.findOneCampaign).toHaveBeenCalledWith('camp-1');
    expect(mockNotificationsService.createNotification).toHaveBeenCalledWith({
      userId: 'creator-1',
      title: 'Contract Signed For:  Test Project',
      message:
        'Your client has signed the contract for Test Project, you may now sign the contract.',
    });
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
