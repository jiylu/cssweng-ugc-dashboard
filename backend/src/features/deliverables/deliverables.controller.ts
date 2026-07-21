import { Controller, Get, Param } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import {
  ApiFindDeliverable,
  ApiFindDeliverablesForCampaign,
  ApiGetCalendarForUser,
} from './docs/deliverables.controller.swagger';

@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @ApiFindDeliverable()
  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.deliverablesService.findOneDeliverableByPublicId(publicId);
  }

  @ApiFindDeliverablesForCampaign()
  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.deliverablesService.findDeliverablesForCampaign(campaignId);
  }

  @ApiGetCalendarForUser()
  @Get('/calendar/:userId')
  getCalendar(@Param('userId') userId: string) {
    return this.deliverablesService.getCalendarDataForUser(userId);
  }
}
