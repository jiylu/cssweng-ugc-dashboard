import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiCreatePayment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Record a payment for a campaign',
      description:
        'Records a new payment for an active campaign identified by its public ID. ' +
        'Requires a proof-of-payment image or video file uploaded as multipart/form-data under the `file` field, ' +
        'and the campaign public ID passed as the `campaignPublic` query parameter.',
    }),
    ApiQuery({
      name: 'campaignPublic',
      required: true,
      type: String,
      description: 'Public ID of the campaign the payment is for',
      example: 'tapYGVM_bk',
    }),
    ApiConsumes('multipart/form-data'),
    ApiBody({
      schema: {
        type: 'object',
        properties: {
          file: {
            type: 'string',
            format: 'binary',
            description: 'Proof of payment image or video file',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Payment recorded successfully.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad request. No file uploaded or the campaign is not ACTIVE.',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiFindPaymentByPublicId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a payment by public ID',
      description:
        'Retrieves a single payment record by its public-facing identifier. ' +
        'The public ID is resolved to the internal payment ID before fetching the record.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the payment',
      example: 'mQlnVSBb0t',
    }),
    ApiResponse({
      status: 200,
      description: 'Payment retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Payment not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiFindPaymentForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find the latest payment for a campaign',
      description:
        'Retrieves the most recent payment record for a campaign identified by its public ID. ' +
        'Campaign existence is validated first, then the payment with the latest creation timestamp is returned.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'tapYGVM_bk',
    }),
    ApiResponse({
      status: 200,
      description: 'Latest payment for the campaign retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found, or no payment exists for the campaign.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiValidatePayment() {
  return applyDecorators(
    ApiOperation({
      summary: 'Validate a payment by public ID',
      description:
        'Marks a payment as verified, marks the related campaign as COMPLETED, ' +
        'and updates the campaign paid amount based on its payment schedule.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the payment to validate',
      example: 'mQlnVSBb0t',
    }),
    ApiResponse({
      status: 200,
      description: 'Payment validated successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Payment not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}
