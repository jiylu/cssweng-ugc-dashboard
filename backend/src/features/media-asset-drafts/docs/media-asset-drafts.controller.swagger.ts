import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

export function ApiCreateMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a media asset draft',
      description: 'Uploads a file and creates a draft for a media asset.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          mediaAssetPublicId: {
            type: 'string',
            description: 'Public ID of the media asset',
          },
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image or video file',
          },
        },
        required: ['mediaAssetPublicId', 'file'],
      },
    }),
    ApiResponse({ status: 201, description: 'Draft created successfully.' }),
    ApiResponse({ status: 400, description: 'Invalid request body or missing file.' }),
    ApiResponse({ status: 404, description: 'Media asset not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({ summary: 'Find a media asset draft by public ID' }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiResponse({ status: 200, description: 'Draft retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}

export function ApiFindMediaAssetDraftsForAsset() {
  return applyDecorators(
    ApiOperation({ summary: 'List drafts for a media asset' }),
    ApiQuery({ name: 'mediaAssetPublicId', required: true, type: String }),
    ApiResponse({ status: 200, description: 'Drafts retrieved successfully.' }),
    ApiResponse({ status: 404, description: 'Media asset not found.' }),
  );
}

export function ApiUpdateMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a media asset draft by public ID',
      description: 'Uploads a new file and updates the draft content_url.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image or video file',
          },
        },
        required: ['file'],
      },
    }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiResponse({ status: 200, description: 'Draft updated successfully.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}

export function ApiDeleteMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete a media asset draft by public ID' }),
    ApiParam({ name: 'publicId', type: String, required: true }),
    ApiResponse({ status: 200, description: 'Draft deleted successfully.' }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}
