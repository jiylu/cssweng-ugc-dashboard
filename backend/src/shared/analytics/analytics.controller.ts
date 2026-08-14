import { Controller, Get, Param } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { ApiGetAnalytics } from './docs/analytics.controller.swagger';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @ApiGetAnalytics()
  @Get(':userId')
  getAnalytics(@Param('userId') userId: string) {
    return this.analyticsService.generateAnalyticsForUser(userId);
  }
}
