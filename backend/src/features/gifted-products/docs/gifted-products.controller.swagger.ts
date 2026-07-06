import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindGiftedProductById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a gifted product by ID',
      description:
        'Retrieves a single gifted product by its internal giftedProductId. Returns full details such as product name, declared value, delivery address/instructions, and ownership terms.',
    }),
    ApiParam({
      name: 'giftedProductId',
      type: String,
      description: 'UUID of the gifted product',
      example: '550e8400-e29b-41d4-a716-446655440010',
    }),
    ApiResponse({
      status: 200,
      description: 'Gifted product retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Gifted product not found.',
    }),
  );
}

export function ApiFindGiftedProductsForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find gifted products for a campaign',
      description:
        'Retrieves all gifted products linked to a campaign. Campaign existence is validated first. Returns null when no gifted products are currently linked.',
    }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description: 'Gifted products retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found.',
    }),
  );
}
