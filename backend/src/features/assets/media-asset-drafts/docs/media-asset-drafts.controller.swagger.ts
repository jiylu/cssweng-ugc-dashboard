import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

const exampleMediaAssetDraftResponse = {
  public_id: 'm3d14Dr4ft',
  content_url: 'https://example.com/storage/media-asset-file.mp4',
  created_at: '2026-08-13T12:00:00.000Z',
  updated_at: '2026-08-13T12:05:00.000Z',
};

export function ApiCreateMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a media asset draft',
      description: 'Uploads a file and creates a new draft version for a specific media asset. Requires multipart/form-data containing the `mediaAssetPublicId` and the `file` to upload.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          mediaAssetPublicId: {
            type: 'string',
            description: 'Public ID of the media asset',
            example: 'pUbl1cId123'
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
    ApiResponse({ 
      status: 201, 
      description: 'Draft created successfully. The file is uploaded and its URL is stored.',
      schema: { example: exampleMediaAssetDraftResponse }
    }),
    ApiResponse({ status: 400, description: 'Invalid request body or missing file.' }),
    ApiResponse({ status: 404, description: 'Media asset not found.' }),
    ApiResponse({ status: 500, description: 'Internal server error.' }),
  );
}

export function ApiFindMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Find a media asset draft by public ID',
      description: 'Retrieves a single media asset draft using its unique public ID.'
    }),
    ApiParam({ name: 'publicId', type: String, required: true, example: 'm3d14Dr4ft' }),
    ApiResponse({ 
      status: 200, 
      description: 'Draft retrieved successfully.',
      schema: { example: exampleMediaAssetDraftResponse }
    }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}

export function ApiFindMediaAssetDraftsForAsset() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'List drafts for a media asset',
      description: 'Retrieves all drafts associated with a specific media asset. Useful for seeing the history of uploaded iterations.'
    }),
    ApiQuery({ name: 'mediaAssetPublicId', required: true, type: String, example: 'pUbl1cId123' }),
    ApiResponse({ 
      status: 200, 
      description: 'Drafts retrieved successfully. Returns an array of drafts.',
      schema: { example: [exampleMediaAssetDraftResponse] }
    }),
    ApiResponse({ status: 404, description: 'Media asset not found.' }),
  );
}

export function ApiUpdateMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({
      summary: 'Update a media asset draft by public ID',
      description: 'Uploads a new file and updates the draft content_url with the newly uploaded file.',
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
    ApiParam({ name: 'publicId', type: String, required: true, example: 'm3d14Dr4ft' }),
    ApiResponse({ 
      status: 200, 
      description: 'Draft updated successfully.',
      schema: { example: exampleMediaAssetDraftResponse }
    }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}

export function ApiDeleteMediaAssetDraft() {
  return applyDecorators(
    ApiOperation({ 
      summary: 'Delete a media asset draft by public ID',
      description: 'Permanently deletes a media asset draft.'
    }),
    ApiParam({ name: 'publicId', type: String, required: true, example: 'm3d14Dr4ft' }),
    ApiResponse({ 
      status: 200, 
      description: 'Draft deleted successfully.',
      schema: { example: exampleMediaAssetDraftResponse }
    }),
    ApiResponse({ status: 404, description: 'Draft not found.' }),
  );
}
