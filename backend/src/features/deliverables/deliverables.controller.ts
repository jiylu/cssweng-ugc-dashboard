import { Controller, Get, Param } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import {
  ApiFindDeliverable,
  ApiFindDeliverableItem,
  ApiFindDeliverableItems,
  ApiFindDeliverablesForCampaign,
  ApiGetCalendarForUser,
} from './docs/deliverables.controller.swagger';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { DeliverablesEntity } from './entities/deliverables.entity';
import { DeliverableItemsEntity } from './entities/deliverable-items.entity';
import { DeliverableItemsService } from './deliverable-items.service';

@Controller('deliverables')
export class DeliverablesController {
  constructor(
    private readonly deliverablesService: DeliverablesService,
    private readonly deliverableItemsService: DeliverableItemsService,
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

  @ApiFindDeliverableItems()
  @Get('/deliverable-items/:publicId')
  async findManyDeliverableItems(@Param('publicId') publicId: string) {
    const deliverableId =
      await this.deliverablesService.resolvePublicId(publicId);

    const deliverableItems =
      await this.deliverableItemsService.findDeliverableItemsForDeliverable(
        deliverableId,
      );

    return plainToInstance(DeliverableItemsEntity, deliverableItems);
  }

  @ApiFindDeliverableItem()
  @Get('/deliverable-items/item/:publicId')
  async findOneDeliverableItem(@Param('publicId') publicId: string) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(publicId);

    const deliverableItem =
      await this.deliverableItemsService.findOneDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(DeliverableItemsEntity, deliverableItem);
  }

  @ApiGetCalendarForUser()
  @Get('/calendar/:userId')
  getCalendar(@Param('userId') userId: string) {
    return this.deliverablesService.getCalendarDataForUser(userId);
  }
}
