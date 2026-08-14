import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindMediaAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a media asset by public ID',
      description:
        'Retrieves a single media asset by its publicId path parameter. ' +
        'The public ID is resolved to the internal media asset ID before fetching the record. ' +
        'Refer to the MediaAssetsEntity for the media asset shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the media asset',
      example: '9eGSafYL98',
    }),
    ApiResponse({
      status: 200,
      description: 'Media asset retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Media asset not found',
    }),
  );
}

export function ApiGetMediaAssetHistoryForDeliverableItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds the media asset history for a deliverable item',
      description:
        'Retrieves every submitted version of the media asset for a deliverable item, ' +
        'ordered by ascending version number. No request body. ' +
        'Refer to the MediaAssetsEntity for the media asset shape.',
    }),
    ApiParam({
      name: 'deliverableItemPublicId',
      type: String,
      description: 'Public ID of the deliverable item',
      example: '9WL6Ka30D0',
    }),
    ApiResponse({
      status: 200,
      description: 'Media asset history retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Deliverable item not found',
    }),
  );
}

export function ApiGetLatestMediaAssetForDeliverableItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds the latest media asset for a deliverable item',
      description:
        'Retrieves the most recent media asset version for a deliverable item. ' +
        'No request body. Refer to the MediaAssetsEntity for the media asset shape.',
    }),
    ApiParam({
      name: 'deliverableItemPublicId',
      type: String,
      description: 'Public ID of the deliverable item',
      example: '9WL6Ka30D0',
    }),
    ApiResponse({
      status: 200,
      description: 'Latest media asset retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description:
        'Deliverable item not found, or no media asset exists for the item',
    }),
  );
}
