import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateProposalCommentDTO } from '../dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from '../dto/update-proposal-status.dto';

export function ApiFindProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds an active proposal by its ID',
      description:
        'Retrieves an active proposal by its proposalId path parameter. No request body. For mutation endpoints refer to UpdateProposalStatusDTO (status updates) and UpdateProposalCommentDTO (comment updates).',
    }),
    ApiParam({
      name: 'proposalId',
      type: String,
      description: 'UUID of the proposal',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
      name: 'proposalId',
      type: String,
      description: 'UUID of the proposal',
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
        'Updates the proposal_status for an active proposal. Request body must follow UpdateProposalStatusDTO (field: proposalStatus - enum). Terminal statuses cannot be transitioned out of (see business rules). Refer to UpdateProposalStatusDTO for the request body schema.',
    }),
    ApiParam({
      name: 'proposalId',
      type: String,
      description: 'UUID of the proposal',
    }),
    ApiBody({ type: UpdateProposalStatusDTO }),
    ApiResponse({
      status: 200,
      description: 'Proposal status updated successfully',
    }),
    ApiResponse({ status: 404, description: 'Proposal not found' }),
    ApiResponse({ status: 400, description: 'Invalid status payload' }),
  );
}

export function ApiFindProposalByCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a proposal by its campaign id',
      description:
        'Retrieves the proposal associated with a campaign (by campaignId). No request body. To create a proposal, use CreateProposalDTO (campaignId, clientEmail). Refer to CreateProposalDTO for creation payload shape.',
    }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
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
