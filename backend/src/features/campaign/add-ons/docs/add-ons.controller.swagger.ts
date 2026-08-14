import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateOptInDTO } from '../dto/update-opt-in.dto';

export function ApiFindAddOnByPublicId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find an add-on by public ID',
      description:
        'Retrieves one add-on record by its public-facing identifier. This endpoint is read-only and returns the stored add-on details including name, fee, initials, and current opt-in state.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the add-on',
      example: 'adn_x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Add-on retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Add-on not found.',
    }),
  );
}

export function ApiFindAddOnsForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find all add-ons for a campaign',
      description:
        'Retrieves all add-ons associated with a campaign. Returns null when the campaign exists but has no add-ons. Campaign existence is validated before querying add-ons.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Campaign add-ons retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found.',
    }),
  );
}

export function ApiUpdateAddOnOptIn() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update add-on opt-in state',
      description:
        'Updates whether an add-on is selected for a campaign using UpdateOptInDTO. Request body only accepts the `optIn` boolean field.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the add-on',
      example: 'adn_x21E9dlf0F',
    }),
    ApiBody({ type: UpdateOptInDTO }),
    ApiResponse({
      status: 200,
      description: 'Add-on opt-in state updated successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Add-on not found.',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid request payload.',
    }),
  );
}
