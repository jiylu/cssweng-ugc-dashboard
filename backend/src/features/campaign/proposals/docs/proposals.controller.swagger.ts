import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateProposalCommentDTO } from '../dto/update-proposal-comment.dto';
import { UpdateProposalStatusDTO } from '../dto/update-proposal-status.dto';

export function ApiUpdateProposalStatus() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a proposal status',
      description:
        'Updates the status of an active proposal by its public ID. Request body must follow UpdateProposalStatusDTO (field: proposalStatus). Setting REJECTED also rejects the proposal, marks the campaign as rejected, and notifies the creator.',
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

export function ApiUpdateProposalComment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a proposal client comment',
      description:
        'Updates the client_comments field on the latest proposal history version and sets the action to REVISE. Request body must follow UpdateProposalCommentDTO (field: comment — 30 to 500 characters).',
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
      description: 'Proposal comment updated successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found or not active',
    }),
    ApiResponse({ status: 400, description: 'Invalid comment payload' }),
  );
}

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

export function ApiReviseProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Revise a proposal',
      description:
        'Updates the client_comments field for an active proposal and sets the action to REVISE. Request body must follow UpdateProposalHistoryCommentDTO (field: comment — 30 to 500 characters). Refer to UpdateProposalHistoryCommentDTO for validation rules and example payload.',
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
      description: 'Proposal revised successfully',
    }),
    ApiResponse({ status: 404, description: 'Proposal not found' }),
    ApiResponse({ status: 400, description: 'Invalid comment payload' }),
  );
}

export function ApiRejectProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Reject a proposal',
      description:
        'Rejects an active proposal. Sets status to REJECTED and updates the action to REJECT.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiResponse({
      status: 200,
      description: 'Proposal rejected successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found or not active',
    }),
  );
}

export function ApiFindProposalByCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a proposal by campaign public ID',
      description:
        'Retrieves the proposal associated with a campaign (by campaign publicId). No request body. To create a proposal, use CreateProposalDTO (campaignId, clientEmail, clientFirstName, clientLastName). Refer to CreateProposalDTO for creation payload shape.',
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

export function ApiAcceptProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Accept a proposal',
      description:
        'Accepts an active proposal by setting its status to ACCEPTED and updating the latest ' +
        'proposal history action to APPROVE. A notification is sent to the campaign creator. ' +
        'No request body is required.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal to accept',
      example: 'e3Fx0pFGsF',
    }),
    ApiResponse({
      status: 200,
      description: 'Proposal accepted successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found or not active.',
    }),
  );
}

export function ApiFindAllProposalHistory() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get all history entries for a proposal',
      description:
        'Retrieves all proposal history entries for a given proposal, ordered by version_number ascending. ' +
        'Uses the proposal public ID to resolve the internal proposal ID. No request body is required.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiResponse({
      status: 200,
      description:
        'Proposal history entries retrieved successfully. Returns an array of history entries.',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found.',
    }),
  );
}

export function ApiCancelProposal() {
  return applyDecorators(
    ApiOperation({
      summary: 'Cancel a proposal',
      description:
        'Cancels an active proposal. Sets status to CANCELLED and updates the action to CANCELLED.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the proposal',
      example: 'e3Fx0pFGsF',
    }),
    ApiResponse({
      status: 200,
      description: 'Proposal cancelled successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found or not active.',
    }),
  );
}

export function ApiFindActiveProposalByClientEmail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find an active proposal by client email',
      description:
        'Retrieves the active proposal (PENDING or FOR_REVISION) for a given client email. ' +
        'Returns null when the client has no active proposal. No request body is required.',
    }),
    ApiParam({
      name: 'clientEmail',
      type: String,
      description: 'Email of the client',
      example: 'client@example.com',
    }),
    ApiResponse({
      status: 200,
      description:
        'Active proposal retrieved successfully. Returns null if none exists.',
    }),
    ApiResponse({
      status: 404,
      description: 'Proposal not found.',
    }),
  );
}

export function ApiFindProposalsForUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find proposals for a user',
      description:
        'Retrieves the pending proposals associated with the active campaigns of a user ' +
        '(creator or client) by their internal user ID. No request body is required.',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      description: 'Internal user ID of the creator or client',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description:
        'Proposals retrieved successfully. Returns an array of proposals.',
    }),
    ApiResponse({
      status: 404,
      description: 'User or proposal not found.',
    }),
  );
}
