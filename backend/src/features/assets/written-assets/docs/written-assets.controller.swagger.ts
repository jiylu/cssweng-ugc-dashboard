import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindWrittenAsset() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a written asset by public ID',
      description:
        'Retrieves a single written asset by its publicId path parameter. ' +
        'The public ID is resolved to the internal written asset ID before fetching the record. ' +
        'Refer to the WrittenAssetsEntity for the written asset shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the written asset',
      example: '01no3tyx3S',
    }),
    ApiResponse({
      status: 200,
      description: 'Written asset retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Written asset not found',
    }),
  );
}

export function ApiGetWrittenAssetHistoryForDeliverableItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds the written asset history for a deliverable item',
      description:
        'Retrieves every submitted version of the written asset for a deliverable item, ' +
        'ordered by ascending version number. No request body. ' +
        'Refer to the WrittenAssetsEntity for the written asset shape.',
    }),
    ApiParam({
      name: 'deliverableItemPublicId',
      type: String,
      description: 'Public ID of the deliverable item',
      example: '9WL6Ka30D0',
    }),
    ApiResponse({
      status: 200,
      description: 'Written asset history retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Deliverable item not found',
    }),
  );
}

export function ApiGetLatestWrittenAssetForDeliverableItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds the latest written asset for a deliverable item',
      description:
        'Retrieves the most recent written asset version for a deliverable item. ' +
        'No request body. Refer to the WrittenAssetsEntity for the written asset shape.',
    }),
    ApiParam({
      name: 'deliverableItemPublicId',
      type: String,
      description: 'Public ID of the deliverable item',
      example: '9WL6Ka30D0',
    }),
    ApiResponse({
      status: 200,
      description: 'Latest written asset retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description:
        'Deliverable item not found, or no written asset exists for the item',
    }),
  );
}
