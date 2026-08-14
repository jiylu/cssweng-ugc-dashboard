import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
} from '@nestjs/swagger';
import { SubmitWrittenAssetDTO } from '../../../assets/written-assets/dto/submit-written-asset.dto';
import { UpdateWrittenAssetCommentDTO } from '../../../assets/written-assets/dto/update-written-asset-comment.dto';
import { UpdateMediaAssetCommentDTO } from '../../../assets/media-assets/dto/update-media-asset-comment.dto';

export function ApiSubmitWrittenAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submits a written asset for a deliverable item',
      description:
        'Creates a new version of the written asset for the given deliverable item. ' +
        'A written asset can only be submitted when the campaign is ACTIVE and its proposal is ACCEPTED, ' +
        'and while no earlier version is still awaiting review. ' +
        'Submitting marks the deliverable IN_PROGRESS and the deliverable item FOR_REVIEW.',
    }),
    ApiBody({ type: SubmitWrittenAssetDTO }),
    ApiResponse({
      status: 201,
      description: 'Written asset submitted successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid payload',
    }),
    ApiResponse({
      status: 404,
      description: 'Deliverable item not found',
    }),
    ApiResponse({
      status: 409,
      description:
        'Written asset cannot be submitted (campaign not ACTIVE, proposal not ACCEPTED, ' +
        'a previous version is still awaiting review, or the asset is already approved)',
    }),
  );
}

export function ApiSubmitMediaAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Submits a media asset for a deliverable item',
      description:
        'Uploads a media file and creates a new version of the media asset for the given deliverable item. ' +
        'Requires the written asset of the deliverable item to be approved first. ' +
        'The file is uploaded to storage and the returned URL is persisted. ' +
        'Accepts multipart/form-data with the `file` field and the `deliverableItemPublicId` form field.',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          deliverableItemPublicId: {
            type: 'string',
            description: 'Public ID of the deliverable item',
            example: 'a3SFgGh1_',
          },
          file: {
            type: 'string',
            format: 'binary',
            description: 'Image or video file',
          },
        },
        required: ['deliverableItemPublicId', 'file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Media asset submitted successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'No file uploaded or unsupported file type',
    }),
    ApiResponse({
      status: 404,
      description: 'Deliverable item not found',
    }),
    ApiResponse({
      status: 409,
      description:
        'Media asset cannot be submitted (written asset not approved, ' +
        'or a previous version is still awaiting review)',
    }),
  );
}

export function ApiApproveWrittenAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Approves a written asset',
      description:
        'Approves the written asset identified by its publicId and marks the deliverable item written asset as approved. ' +
        'Only an asset whose action is still PENDING can be approved.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the written asset',
      example: 'mOpCDFHY0d',
    }),
    ApiResponse({
      status: 200,
      description: 'Written asset approved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Written asset not found',
    }),
    ApiResponse({
      status: 409,
      description:
        'Written asset is already approved, or the asset action can no longer be updated',
    }),
  );
}

export function ApiReviseWrittenAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Requests a revision for a written asset',
      description:
        'Adds client feedback to the written asset identified by its publicId and sets its action to REVISE, ' +
        'prompting the creator to resubmit a new version. ' +
        'Only an asset whose action is still PENDING can be revised.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the written asset',
      example: 'Ql6hPdXLSf',
    }),
    ApiBody({ type: UpdateWrittenAssetCommentDTO }),
    ApiResponse({
      status: 200,
      description: 'Written asset revision requested successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid payload',
    }),
    ApiResponse({
      status: 404,
      description: 'Written asset not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Written asset action can no longer be updated',
    }),
  );
}

export function ApiApproveMediaAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Approves a media asset',
      description:
        'Approves the media asset identified by its publicId, marks the deliverable item media asset as approved, ' +
        'and if all items have both written and media assets approved, approves the deliverable and marks the campaign deliverables as complete. ' +
        'Only an asset whose action is still PENDING can be approved.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the media asset',
      example: '9eGSafYL98',
    }),
    ApiResponse({
      status: 200,
      description: 'Media asset approved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Media asset not found',
    }),
    ApiResponse({
      status: 409,
      description:
        'Media asset is already approved, or the asset action can no longer be updated',
    }),
  );
}

export function ApiReviseMediaAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Requests a revision for a media asset',
      description:
        'Adds client feedback to the media asset identified by its publicId and sets its action to REVISE, ' +
        'prompting the creator to resubmit a new version. ' +
        'Only an asset whose action is still PENDING can be revised.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the media asset',
      example: 'wJ5o3nHymF',
    }),
    ApiBody({ type: UpdateMediaAssetCommentDTO }),
    ApiResponse({
      status: 200,
      description: 'Media asset revision requested successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid payload',
    }),
    ApiResponse({
      status: 404,
      description: 'Media asset not found',
    }),
    ApiResponse({
      status: 409,
      description: 'Media asset action can no longer be updated',
    }),
  );
}
