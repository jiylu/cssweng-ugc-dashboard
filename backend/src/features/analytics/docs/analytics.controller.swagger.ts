import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

export function ApiGetAnalytics() {
  return applyDecorators(
    ApiOperation({
      summary: 'Get analytics for a user',
      description:
        'Generates dashboard analytics for an active user. The response currently includes the number of active campaigns assigned to the user and the number of pending proposal records found for those campaigns.',
    }),
    ApiParam({
      name: 'userId',
      type: String,
      required: true,
      description: 'ID of the active user whose analytics should be generated',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiResponse({
      status: 200,
      description:
        'Analytics generated successfully. Returns active_campaigns and pending_proposals counts.',
    }),
    ApiResponse({
      status: 404,
      description:
        'User not found (USER_NOT_FOUND). The provided userId does not reference an active user.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while generating analytics.',
    }),
  );
}
