import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { CreateDeliverableDTO } from '../dto/create-deliverable.dto';

export function ApiFindDeliverable() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a deliverable by public id',
      description:
        'Retrieves a single deliverable by its publicId path parameter. No request body. Refer to CreateDeliverableDTO for the deliverable resource shape; for updates use UpdateDeliverableDTO.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'publicId of the deliverable',
    }),
    ApiResponse({
      status: 200,
      description: 'Deliverable retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Deliverable not found' }),
  );
}

export function ApiFindDeliverablesForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds deliverables for a campaign',
      description:
        'Retrieves all deliverables for the given campaign public ID. No request body. Refer to CreateDeliverableDTO for the deliverable schema; for creating deliverables use CreateDeliverableDTO and for partial updates refer to UpdateDeliverableDTO.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Deliverables retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Campaign not found' }),
  );
}

export function ApiCreateDeliverable() {
  return applyDecorators(
    ApiOperation({
      summary: 'Creates a deliverable',
      description:
        'Creates a deliverable for a campaign. Request body must follow CreateDeliverableDTO (campaignId, quantity, deliverableType, deliverableContent, requirements, dueDate, postDate, pricing). The endpoint verifies the referenced campaign exists before creating the deliverable.',
    }),
    ApiBody({ type: CreateDeliverableDTO }),
    ApiResponse({
      status: 201,
      description: 'Deliverable created successfully',
    }),
    ApiResponse({ status: 404, description: 'Campaign not found' }),
    ApiResponse({ status: 400, description: 'Invalid payload' }),
  );
}

export function ApiGetCalendarForUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Gets calendar data for a user',
      description:
        'Retrieves all deliverables due for a user across their active campaigns with accepted proposals. Returns an array of calendar entries containing campaign name, deliverable details, public ID, due date, and post date.',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'UUID of the user',
    }),
    ApiResponse({
      status: 200,
      description: 'Calendar data retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'User or campaigns not found' }),
  );
}
