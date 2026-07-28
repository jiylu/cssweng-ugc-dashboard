import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateProposalCommentDTO } from '../dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from '../dto/update-proposal-status.dto';

export function ApiFindProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds an active proposal by its Public ID',
      description:
        'Retrieves an active proposal by its public Id path parameter. No request body. For mutation endpoints refer to UpdateProposalStatusDTO (status updates) and UpdateProposalCommentDTO (comment updates).',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public id of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiResponse({
      status: 200,
      description: 'Proposal retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Proposal not found' }),
  );
}

export function ApiUpdateProposalComments() {
  return applyDecorators(
    ApiOperation({
      summary: 'Updates comments on a proposal',
      description:
        'Updates the client_comments field for an active proposal. Request body must follow UpdateProposalCommentDTO (field: comment — 30 to 500 characters). Refer to UpdateProposalCommentDTO for validation rules and example payload.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiBody({ type: UpdateProposalCommentDTO }),
    ApiResponse({
      status: 200,
      description: 'Proposal comments updated successfully',
    }),
    ApiResponse({ status: 404, description: 'Proposal not found' }),
    ApiResponse({ status: 400, description: 'Invalid comment payload' }),
  );
}

export function ApiUpdateProposalStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Updates the status of a proposal',
      description:
        'Updates the proposal_status for an active proposal. Request body must follow UpdateProposalStatusDTO (field: proposalStatus - enum). ' +
        'Allowed values: `PENDING`, `FOR_REVISION`, `ACCEPTED`, `REJECTED`. ' +
        'Only proposals with status PENDING or FOR_REVISION can be updated. Refer to UpdateProposalStatusDTO for the request body schema.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiBody({ type: UpdateProposalStatusDTO }),
    ApiResponse({
      status: 200,
      description: 'Proposal status updated successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found or not active',
    }),
    ApiResponse({ status: 400, description: 'Invalid status payload' }),
  );
}

export function ApiFindProposalByCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a proposal by campaign public ID',
      description:
        'Retrieves the proposal associated with a campaign (by campaign publicId). No request body. To create a proposal, use CreateProposalDTO (campaignId, clientEmail). Refer to CreateProposalDTO for creation payload shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Proposal retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found for given campaign',
    }),
  );
}
