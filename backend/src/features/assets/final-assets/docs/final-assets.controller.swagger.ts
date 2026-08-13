import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiFindFinalAssetsForCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds final assets for a campaign',
      description:
        'Retrieves all final assets of a campaign, grouped by the public ID of each deliverable. ' +
        'Final assets are only returned if the campaign is fully paid. ' +
        'Refer to the FinalAssetsEntity for the final asset shape.',
    }),
    ApiParam({
      name: 'campaignPublicId',
      type: String,
      description: 'Public ID of the campaign',
      example: '9eGSafYL98',
    }),
    ApiResponse({
      status: 200,
      description:
        'Final assets retrieved successfully, keyed by deliverable public ID',
      schema: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            deliverablePublicId: { type: 'string' },
            finalAssets: {
              type: 'array',
              items: { type: 'object' },
            },
          },
        },
        example: {
          deliverable_1: {
            deliverablePublicId: 'HKXGW-zYMZ',
            finalAssets: [
              {
                public_id: '9eGSafYL98',
                file_url: 'https://storage.example.com/assets/video.mp4',
                created_at: '2026-08-13T00:00:00.000Z',
              },
            ],
          },
          deliverable_2: {
            deliverablePublicId: 'a3SFgGh1_',
            finalAssets: [],
          },
        },
      },
    }),
    ApiResponse({
      status: 403,
      description: 'Campaign is not fully paid',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found',
    }),
  );
}
