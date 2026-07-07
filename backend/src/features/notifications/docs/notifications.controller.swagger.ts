import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';

export function ApiFindNotification() {
  return applyDecorators(
    ApiOperation({
      summary: 'Find a single notification by ID',
      description:
        'Retrieves one notification record using its `notificationId` path parameter. ' +
        'Use this endpoint when opening a specific notification detail view. ' +
        'If no notification exists for the given ID, the endpoint returns a 404 NOTIFICATION_NOT_FOUND error.',
    }),
    ApiParam({
      name: 'notificationId',
      type: String,
      required: true,
      description: 'Unique identifier of the notification to retrieve',
      example: 'not_f4C2a9QzR8',
    }),
    ApiResponse({
      status: 200,
      description:
        'Notification retrieved successfully. Response includes metadata such as title, message, read state, and timestamps.',
    }),
    ApiResponse({
      status: 404,
      description:
        'Notification not found (NOTIFICATION_NOT_FOUND). The provided ID does not match any existing notification.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while retrieving notification.',
    }),
  );
}

export function ApiFindNotificationsForUser() {
  return applyDecorators(
    ApiOperation({
      summary: 'List notifications for a user',
      description:
        'Retrieves notifications for a specific user in descending order by creation timestamp (newest first). ' +
        'Requires `userId` query parameter and optionally accepts `limit` to cap returned records. ' +
        'The endpoint validates that the user exists and is active before querying notifications.',
    }),
    ApiQuery({
      name: 'userId',
      required: true,
      type: String,
      description:
        'ID of the user whose notifications should be returned. Must reference an active user.',
      example: '550e8400-e29b-41d4-a716-446655440000',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description:
        'Optional maximum number of notifications to return. Must be a positive integer (>= 1).',
      example: 10,
    }),
    ApiResponse({
      status: 200,
      description:
        'Notifications retrieved successfully. Returns an array of notification objects ordered by created_at DESC.',
    }),
    ApiResponse({
      status: 404,
      description:
        'User not found (USER_NOT_FOUND). The given userId does not reference an active user.',
    }),
    ApiResponse({
      status: 400,
      description:
        'Invalid query parameters (e.g., missing userId or non-numeric/invalid limit).',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while retrieving notifications.',
    }),
  );
}

export function ApiMarkNotificationAsRead() {
  return applyDecorators(
    ApiOperation({
      summary: 'Mark notification as read',
      description:
        'Marks an unread notification as read by setting `is_read` to `true`. ' +
        'If the notification is already read, the endpoint returns a 409 NOTIFICATION_ALREADY_READ conflict. ' +
        'If the notification does not exist, it returns 404 NOTIFICATION_NOT_FOUND.',
    }),
    ApiParam({
      name: 'notificationId',
      type: String,
      required: true,
      description: 'Unique identifier of the notification to mark as read',
      example: 'not_f4C2a9QzR8',
    }),
    ApiResponse({
      status: 201,
      description:
        'Notification marked as read successfully. Updated notification is returned with is_read=true.',
    }),
    ApiResponse({
      status: 404,
      description: 'Notification not found (NOTIFICATION_NOT_FOUND).',
    }),
    ApiResponse({
      status: 409,
      description:
        'Notification already read (NOTIFICATION_ALREADY_READ). No state change was applied.',
    }),
    ApiResponse({
      status: 500,
      description: 'Internal server error while updating notification state.',
    }),
  );
}
