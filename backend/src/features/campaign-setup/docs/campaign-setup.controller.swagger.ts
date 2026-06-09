import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateCampaignRequestDto } from '../dto/create-campaign-request-dto';

export function ApiCreateFullCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Creates a campaign together with its proposal and deliverables',
      description:
        'Takes a CreateCampaignRequestDto consisting of: campaign (ugcId, projectName, description, startDate, endDate), an array of deliverables (each: deliverableTitle, description, deadline, pricing, deliverableType), and a proposal (clientEmail). Pricing for the campaign is computed as the sum of deliverable pricing. The operation is executed inside a database transaction; on failure the whole operation is rolled back.',
    }),
    ApiBody({ type: CreateCampaignRequestDto }),
    ApiResponse({
      status: 201,
      description: 'Campaign, proposal, and deliverables created successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request payload (validation failed)',
    }),
    ApiResponse({
      status: 404,
      description:
        'Referenced resource not found (e.g., ugc creator or campaign) or client email not resolvable',
    }),
    ApiResponse({
      status: 409,
      description:
        'Conflict: client has active engagement or proposal already exists',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error — transaction rolled back',
    }),
  );
}
