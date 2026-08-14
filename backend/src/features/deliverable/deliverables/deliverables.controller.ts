import { Controller, Get, Param } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import {
  ApiFindDeliverable,
  ApiFindDeliverablesForCampaign,
  ApiGetCalendarForUser,
} from './docs/deliverables.controller.swagger';
import { CampaignsService } from '../../campaign/campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { DeliverablesEntity } from './entities/deliverables.entity';

@Controller('deliverables')
export class DeliverablesController {
  constructor(
    private readonly deliverablesService: DeliverablesService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindDeliverable()
  @Get(':publicId')
  async findOne(@Param('publicId') publicId: string) {
    const deliverableId =
      await this.deliverablesService.resolvePublicId(publicId);
    const deliverable =
      await this.deliverablesService.findOneDeliverableByUID(deliverableId);

    return plainToInstance(DeliverablesEntity, deliverable);
  }

  @ApiFindDeliverablesForCampaign()
  @Get('/campaign/:publicId')
  async findMany(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const deliverables =
      await this.deliverablesService.findDeliverablesForCampaign(campaignId);

    return plainToInstance(DeliverablesEntity, deliverables);
  }

  @ApiGetCalendarForUser()
  @Get('/calendar/:userId')
  getCalendar(@Param('userId') userId: string) {
    return this.deliverablesService.getCalendarDataForUser(userId);
  }
}
