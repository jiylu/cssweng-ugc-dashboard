import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindDeliverableItems() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds deliverable items for a deliverable',
      description:
        'GET /deliverable-items/deliverable/:publicId - ' +
        'Retrieves all deliverable items for the given deliverable public ID, ordered by deliverable index. ' +
        'The deliverable public ID is resolved to the internal deliverable ID before fetching the items. ' +
        'No request body. Refer to the DeliverableItemsEntity for the deliverable item shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the deliverable',
      example: 'sf857pbKer',
    }),
    ApiResponse({
      status: 200,
      description: 'Deliverable items retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Deliverable not found' }),
  );
}

export function ApiFindDeliverableItem() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a deliverable item by public id',
      description:
        'GET /deliverable-items/item/:publicId - ' +
        'Retrieves a single deliverable item by its own publicId path parameter. ' +
        'The public ID is resolved to the internal deliverable item ID before fetching the record. ' +
        'No request body. Refer to the DeliverableItemsEntity for the deliverable item shape.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the deliverable item',
      example: 'HD9WXeFLCK',
    }),
    ApiResponse({
      status: 200,
      description: 'Deliverable item retrieved successfully',
    }),
    ApiResponse({ status: 404, description: 'Deliverable item not found' }),
  );
}
