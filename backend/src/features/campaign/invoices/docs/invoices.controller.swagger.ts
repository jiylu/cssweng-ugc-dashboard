import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiCreateInvoice() {
  return applyDecorators(
    ApiOperation({
      summary: 'Store an invoice for a campaign',
      description:
        'Stores a new invoice for an active campaign whose deliverables are all approved, identified by its public ID. ' +
        'Requires the invoice file uploaded as multipart/form-data under the `file` field, ' +
        'and the campaign public ID passed as the `campaignPublic` query parameter. ' +
        'Only one invoice may exist per campaign.',
    }),
    ApiQuery({
      name: 'campaignPublic',
      required: true,
      type: String,
      description: 'Public ID of the campaign the invoice is for',
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
            description: 'Invoice file',
          },
        },
        required: ['file'],
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Invoice stored successfully.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Bad request. No file uploaded, the campaign is not ACTIVE, or not all deliverables are approved.',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found.',
    }),
    ApiResponse({
      status: 409,
      description: 'An invoice already exists for this campaign.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiFindInvoiceByPublicId() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find an invoice by public ID',
      description:
        'Retrieves a single invoice record by its public-facing identifier. ' +
        'The public ID is resolved to the internal invoice ID before fetching the record.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the invoice',
      example: 'mQlnVSBb0t',
    }),
    ApiResponse({
      status: 200,
      description: 'Invoice retrieved successfully.',
    }),
    ApiResponse({
      status: 404,
      description: 'Invoice not found.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error.',
    }),
  );
}

export function ApiFindInvoiceForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find the invoice for a campaign',
      description:
        'Retrieves the invoice for a campaign identified by its public ID. ' +
        'Campaign existence is validated first. Returns null if the campaign has no invoice yet.',
    }),
    ApiParam({
      name: 'publicId',
      type: String,
      description: 'Public ID of the campaign',
      example: 'tapYGVM_bk',
    }),
    ApiResponse({
      status: 200,
      description: 'Invoice for the campaign retrieved successfully.',
      schema: {
        type: 'object',
        nullable: true,
        properties: {
          public_id: {
            type: 'string',
            description: 'Public-facing identifier of the invoice',
            example: 'mQlnVSBb0t',
          },
          invoice_url: {
            type: 'string',
            description: 'URL of the uploaded invoice file',
            example: 'https://storage.supabase.co/invoices/invoice.pdf',
          },
          created_at: {
            type: 'string',
            format: 'date-time',
            description: 'Timestamp the invoice record was created',
            example: '2026-08-13T10:00:00.000Z',
          },
        },
      },
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
