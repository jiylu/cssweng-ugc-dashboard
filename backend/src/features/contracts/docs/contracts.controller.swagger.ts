import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateContractDTO } from '../dto/update-contract.dto';

export function ApiFindContractByPublicId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a contract by its Public ID',
      description:
        'Retrieves a single contract document using its unique public-facing identifier. ' +
        'The returned contract contains all negotiated terms including revision policy, usage rights, ' +
        'posting requirements, exclusivity, expenses/purchases terms, cancellation period, payment terms, ' +
        'invoice requirements, general terms, and any extra notes. ' +
        'Refer to CreateContractDTO for the full contract shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'The unique public-facing identifier of the contract',
      example: 'ctr_a1B2c3D4e5',
    }),
    ApiResponse({
      status: 200,
      description: 'Contract retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Contract not found. No contract exists with the given public ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiFindContractByCampaignId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a contract by campaign public ID',
      description:
        'Retrieves the contract linked to a campaign using the campaign public ID. The campaign is validated first, then the matching contract is returned. This is the lookup used by campaign setup flows.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Contract retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Contract not found for the given campaign, or the campaign does not exist.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiSignContract() {
  return applyDecorators(
    ApiOperation({
      summary: 'Sign a contract by its Public ID',
      description:
        'Signs an existing contract identified by its public ID. ' +
        'This sets the `is_signed` field to true and records the current timestamp in `signed_at`. ' +
        'A contract can only be signed once; attempting to sign an already-signed contract may result in a conflict error. ' +
        'Contracts are created through the campaign-setup endpoint, not directly through this controller.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description:
        'The unique public-facing identifier of the contract to sign',
      example: 'ctr_a1B2c3D4e5',
    }),
    ApiResponse({
      status: 200,
      description:
        'Contract signed successfully. The `is_signed` field is now true and `signed_at` has been recorded.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request. The provided public ID is invalid.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Contract not found. No contract exists with the given public ID.',
    }),
    ApiResponse({
      status: 409,
      description: 'Conflict. The contract has already been signed.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiUpdateContractDetails() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update contract details by public ID',
      description:
        'Updates editable contract fields for a contract identified by its public ID. ' +
        'Request body follows UpdateContractDTO, which is derived from CreateContractDTO with `campaignId` omitted and all remaining fields optional. ' +
        'Only fields included in the payload are updated; omitted fields remain unchanged.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the contract to update',
      example: 'ctr_a1B2c3D4e5',
    }),
    ApiBody({ type: UpdateContractDTO, required: false }),
    ApiResponse({
      status: 200,
      description: 'Contract updated successfully.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request body. One or more fields failed DTO validation.',
    }),
    ApiResponse({
      status: 404,
      description: 'Contract not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}
