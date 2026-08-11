import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { UpdateProposalCommentDTO } from '../dto/update-proposal-comment.dto';

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

