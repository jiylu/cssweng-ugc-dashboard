import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CreateWrittenAssetDraftDto } from '../dto/create-written-asset-draft.dto';
import { UpdateWrittenAssetDraftDto } from '../dto/update-written-asset-draft.dto';

export function ApiCreateWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a written asset draft',
      description: 'Creates a draft for a written asset.',
    }),
    ApiBody({ type: CreateWrittenAssetDraftDto }),
    ApiResponse({ status: 201, description: 'Draft created successfully.' }),
    ApiResponse({ status: 400, description: 'Invalid request body.' }),
    ApiResponse({ status: 404, description: 'Written asset not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a written asset draft by public ID',
    }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiResponse({ status: 200, description: 'Draft retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindWrittenAssetDraftsForAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'List drafts for a written asset',
    }),
    ApiQuery({ name: 'writtenAssetPublicId', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Drafts retrieved successfully.' }),
    ApiResponse({ status: 400, description: 'Invalid query parameters.' }),
    ApiResponse({ status: 404, description: 'Written asset not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiUpdateWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a written asset draft by public ID',
    }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiBody({ type: UpdateWrittenAssetDraftDto, required: false }),
    ApiResponse({ status: 200, description: 'Draft updated successfully.' }),
    ApiResponse({ status: 400, description: 'Invalid request body.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiDeleteWrittenAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Delete a written asset draft by public ID',
    }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiResponse({ status: 200, description: 'Draft deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}
