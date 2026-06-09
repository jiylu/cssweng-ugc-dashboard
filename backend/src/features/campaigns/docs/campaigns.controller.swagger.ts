import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { UpdateCampaignStatusDto } from '../dto/update-campaign-status-dto';
import { UpdateCampaignClientDTO } from '../dto/update-campaign-client.dto';

export function ApiFindOneCampaign() {
  return applyDecorators(
    ApiOperation({
      summary: 'Finds a campaign using a campaignId parameter',
    }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign to retrieve',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
      required: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Campaign retrieved successfully',
    }),
    ApiResponse({
      status: 404,
      description: 'Campaign not found',
    }),
  );
}

export function ApiFindAllCampaigns() {
  return applyDecorators(
    ApiOperation({
      summary: 'Retrieves all campaigns with optional filtering and pagination',
    }),
    ApiQuery({
      name: 'creatorId',
      required: true,
      type: String,
      description: 'Filter campaigns by UGC creator ID',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: 'Page number (default: 1)',
      example: 1,
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Number of results per page (default: 10)',
      example: 10,
    }),
    ApiQuery({
      name: 'activeOnly',
      required: false,
      type: Boolean,
      description: 'If true, returns only active campaigns',
      example: true,
    }),
    ApiResponse({
      status: 200,
      description: 'Campaigns retrieved successfully',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request (no creatorId query)',
    }),
    ApiResponse({
      status: 404,
      description: 'User not found (USER_NOT_FOUND)',
    }),
  );
}

export function ApiUpdateCampaignStatus() {
  return applyDecorators(
    ApiOperation({ summary: 'Updates the status of a campaign' }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign to update',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiBody({ type: UpdateCampaignStatusDto }),
    ApiResponse({
      status: 200,
      description: 'Campaign status updated successfully',
    }),
    ApiResponse({ status: 404, description: 'Campaign not found' }),
    ApiResponse({
      status: 409,
      description: 'Campaign is already rejected and cannot be updated',
    }),
  );
}

export function ApiUpdateCampaignClient() {
  return applyDecorators(
    ApiOperation({ summary: 'Assigns a client to a campaign' }),
    ApiParam({
      name: 'campaignId',
      type: String,
      description: 'UUID of the campaign to update',
      example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    }),
    ApiBody({ type: UpdateCampaignClientDTO }),
    ApiResponse({
      status: 200,
      description: 'Client assigned to campaign successfully',
    }),
    ApiResponse({ status: 404, description: 'Campaign not found' }),
    ApiResponse({
      status: 409,
      description: 'Campaign already has a client assigned',
    }),
  );
}
