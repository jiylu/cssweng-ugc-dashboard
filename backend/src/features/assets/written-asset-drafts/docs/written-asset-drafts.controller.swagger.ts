import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateWrittenAssetDraftDto } from '../dto/create-written-asset-draft.dto';
import { UpdateWrittenAssetDraftDto } from '../dto/update-written-asset-draft.dto';

const exampleWrittenAssetDraftResponse = {
  public_id: 'x21E9dlf0F',
  content: 'Draft content for the written asset...',
  created_at: '2026-08-13T12:00:00.000Z',
  updated_at: '2026-08-13T12:05:00.000Z',
};

export function ApiCreateWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a written asset draft',
      description:
        'Creates a new draft version for a specific written asset. Requires the written asset public ID and the text content of the draft.',
    }),
    ApiBody({ type: CreateWrittenAssetDraftDto }),
    ApiResponse({
      status: 201,
      description:
        'Draft created successfully. Returns the created draft details.',
      schema: { example: exampleWrittenAssetDraftResponse },
    }),
    ApiResponse({ status: 400, description: 'Invalid request body payload.' }),
    ApiResponse({
      status: 404,
      description:
        'Written asset not found. The provided writtenAssetPublicId does not exist.',
    }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a written asset draft by public ID',
      description:
        'Retrieves a single written asset draft using its unique public ID.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description: 'Draft retrieved successfully.',
      schema: { example: exampleWrittenAssetDraftResponse },
    }),
    ApiResponse({
      status: 404,
      description:
        'Draft not found. The given public ID does not match any existing draft.',
    }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindWrittenAssetDraftsForAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'List drafts for a written asset',
      description:
        'Retrieves all drafts associated with a specific written asset. Useful for version history or recovering previous drafts.',
    }),
    ApiQuery({
      name: 'writtenAssetPublicId',
      required: true,
      type: String,
      example: 'pub-written-1',
    }),
    ApiResponse({
      status: 200,
      description: 'Drafts retrieved successfully. Returns an array of drafts.',
      schema: { example: [exampleWrittenAssetDraftResponse] },
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid query parameters (e.g., missing writtenAssetPublicId).',
    }),
    ApiResponse({ status: 404, description: 'Written asset not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiUpdateWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a written asset draft by public ID',
      description:
        'Updates the content of an existing written asset draft. Only provided fields are updated.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      example: 'x21E9dlf0F',
    }),
    ApiBody({ type: UpdateWrittenAssetDraftDto, required: false }),
    ApiResponse({
      status: 200,
      description: 'Draft updated successfully.',
      schema: { example: exampleWrittenAssetDraftResponse },
    }),
    ApiResponse({ status: 400, description: 'Invalid request body.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiDeleteWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a written asset draft by public ID',
      description: 'Permanently deletes a written asset draft.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      required: true,
      example: 'x21E9dlf0F',
    }),
    ApiResponse({
      status: 200,
      description:
        'Draft deleted successfully. Returns the details of the deleted draft.',
      schema: { example: exampleWrittenAssetDraftResponse },
    }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}
