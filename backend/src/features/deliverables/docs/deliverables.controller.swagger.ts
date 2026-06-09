import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateDeliverableDTO } from '../dto/update-deliverable.dto';
import { CreateDeliverableDTO } from '../dto/create-deliverable.dto';

export function ApiFindDeliverable() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a deliverable by id',
      description:
        'Retrieves a single deliverable by its deliverableId path parameter. No request body. Refer to CreateDeliverableDTO for the deliverable resource shape; for updates use UpdateDeliverableDTO.',
    }),
    ApiParam({
      name: 'deliverableId',
      type: String,
      description: 'UUID of the deliverable',
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
        'Retrieves all deliverables for the given campaignId. No request body. Refer to CreateDeliverableDTO for the deliverable schema; for creating deliverables use CreateDeliverableDTO and for partial updates refer to UpdateDeliverableDTO.',
    }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign',
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
        'Creates a deliverable for a campaign. Request body must follow CreateDeliverableDTO (campaignId, deliverableTitle, description, deadline, pricing, deliverableType). The endpoint verifies the referenced campaign exists before creating the deliverable.',
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

export function ApiUpdateDeliverable() {
  return applyDecorators(
    ApiOperation({
      summary: 'Updates a deliverable',
      description:
        'All fields in the request body are optional — include only the fields you want to change. Request body should follow UpdateDeliverableDTO (all fields optional). Refer to UpdateDeliverableDTO for validation rules and examples.',
    }),
    ApiParam({
      name: 'deliverableId',
      type: String,
      description: 'UUID of the deliverable',
    }),
    ApiBody({ type: UpdateDeliverableDTO, required: false }),
    ApiResponse({
      status: 200,
      description: 'Deliverable updated successfully',
    }),
    ApiResponse({ status: 404, description: 'Deliverable not found' }),
    ApiResponse({ status: 400, description: 'Invalid payload' }),
  );
}
