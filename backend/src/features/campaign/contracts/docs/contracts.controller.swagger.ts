import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateContractDTO } from '../dto/update-contract.dto';
import { SignContractDTO } from '../dto/sign-contract.dto';

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
        'Requires uploading `signature` and `initials` image files via multipart/form-data. ' +
        'It sets either `client_signed` or `creator_signed` to true based on the provided signerRole.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          signerRole: {
            type: 'string',
            description: 'The role of the signer (e.g., CLIENT)',
          },
          signature: {
            type: 'string',
            format: 'binary',
            description: 'Image file for the signature',
          },
          initials: {
            type: 'string',
            format: 'binary',
            description: 'Image file for the initials',
          },
        },
        required: ['signerRole', 'signature', 'initials'],
      },
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
      description: 'Contract signed successfully.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad request. The provided public ID or query parameters are invalid.',
    }),
    ApiResponse({
      status: 403,
      description:
        'Forbidden. The client must sign the contract before the creator.',
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

export function ApiGetContractSignatures() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get signatures for a contract',
      description:
        'Retrieves all signatures (both client and creator, if available) for a given contract identified by its public ID.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the contract',
      example: 'ctr_a1B2c3D4e5',
    }),
    ApiResponse({
      status: 200,
      description: 'Signatures retrieved successfully.',
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
