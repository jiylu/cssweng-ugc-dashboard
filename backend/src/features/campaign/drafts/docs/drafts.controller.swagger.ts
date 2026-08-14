import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateDraftDto } from '../dto/create-draft.dto';
import { UpdateDraftDto } from '../dto/update-draft.dto';

export function ApiCreateDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a draft',
      description:
        'Creates a draft for an authenticated user. ' +
        'The request body must follow CreateDraftDto: `userId` is required, while `campaign`, `proposal`, ' +
        '`deliverables`, `addOns`, `giftedProducts`, and `contract` are optional and stored as JSON content. ' +
        'The endpoint validates that the user exists and is active before creating the draft. ' +
        'A unique public ID is generated and returned so the draft can be referenced later.',
    }),
    ApiBody({ type: CreateDraftDto }),
    ApiResponse({
      status: 201,
      description:
        'Draft created successfully. Returns the draft with its generated public ID.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request body. One or more fields failed DTO validation.',
    }),
    ApiResponse({
      status: 404,
      description:
        'User not found (USER_NOT_FOUND). The given userId does not reference an active user.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while creating the draft.',
    }),
  );
}

export function ApiFindDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a draft by public ID',
      description:
        'Retrieves a single draft using its public-facing `publicId` path parameter. ' +
        'The public ID is resolved to the internal draft ID and the draft is returned only if it has not been ' +
        'soft-deleted. No request body is required.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      description: 'Public ID of the draft to retrieve',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description:
        'Draft retrieved successfully. Returns the draft including its stored JSON content.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Draft not found (DRAFT_NOT_FOUND). No active draft exists with the given public ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while retrieving the draft.',
    }),
  );
}

export function ApiFindDraftsForUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'List drafts for a user',
      description:
        'Retrieves all non-deleted drafts belonging to a user. ' +
        'Requires the `userId` query parameter. The endpoint validates that the user exists and is active ' +
        'before querying drafts.',
    }),
    ApiQuery({
      name: 'userId',
      required: true,
      type: String,
      description:
        'ID of the user whose drafts should be returned. Must reference an active user.',
      example: '171005e9-10f1-4402-a655-7ef0e1ac1656',
    }),
    ApiResponse({
      status: 200,
      description:
        'Drafts retrieved successfully. Returns an array of drafts for the user.',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid query parameters (e.g., missing userId).',
    }),
    ApiResponse({
      status: 404,
      description:
        'User not found (USER_NOT_FOUND). The given userId does not reference an active user.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while retrieving drafts.',
    }),
  );
}

export function ApiUpdateDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a draft by public ID',
      description:
        'Updates a draft identified by its public-facing `publicId`. ' +
        'The request body follows UpdateDraftDto; only fields included in the payload are updated, ' +
        'and omitted fields remain unchanged. The draft must not be soft-deleted.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      description: 'Public ID of the draft to update',
      example: 'x21E9dlf0F',
    }),
    ApiBody({ type: UpdateDraftDto, required: false }),
    ApiResponse({
      status: 200,
      description: 'Draft updated successfully.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid request body. One or more fields failed DTO validation.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Draft not found (DRAFT_NOT_FOUND). No active draft exists with the given public ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while updating the draft.',
    }),
  );
}

export function ApiDeleteDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a draft by public ID',
      description:
        'Soft-deletes a draft identified by its public-facing `publicId` by setting `is_deleted` to `true`. ' +
        'The draft is excluded from future reads. No request body is required.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      description: 'Public ID of the draft to delete',
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description:
        'Draft deleted successfully. Returns the draft with `is_deleted` set to `true`.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Draft not found (DRAFT_NOT_FOUND). No active draft exists with the given public ID.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while deleting the draft.',
    }),
  );
}
