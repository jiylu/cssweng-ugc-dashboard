import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindGiftedProductById() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a gifted product by public ID',
      description:
        'Retrieves a single gifted product by its publicId. Returns full details such as product name, declared value, shipping address/instructions, and ownership terms.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the gifted product',
      example: 'oPx21dlEa',
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
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'oPx21dlEa',
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
