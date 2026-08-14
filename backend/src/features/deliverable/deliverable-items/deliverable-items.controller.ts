import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DeliverableItemsService } from './deliverable-items.service';
import { DeliverablesService } from '../deliverables/deliverables.service';
import { DeliverableItemsEntity } from './entities/deliverable-items.entity';
import {
  ApiFindDeliverableItem,
  ApiFindDeliverableItems,
} from './docs/deliverable-items.controller.swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';

@Controller('deliverable-items')
export class DeliverableItemsController {
  constructor(
    private readonly deliverableItemsService: DeliverableItemsService,
    private readonly deliverablesService: DeliverablesService,
  ) {}

  @ApiFindDeliverableItems()
  @Get('/deliverable/:publicId')
  @UseGuards(RolesGuard)
  async findMany(@Param('publicId') publicId: string) {
    const deliverableId =
      await this.deliverablesService.resolvePublicId(publicId);

    const deliverableItems =
      await this.deliverableItemsService.findDeliverableItemsForDeliverable(
        deliverableId,
      );

    return plainToInstance(DeliverableItemsEntity, deliverableItems);
  }

  @ApiFindDeliverableItem()
  @Get('item/:publicId')
  @UseGuards(RolesGuard)
  async findOne(@Param('publicId') publicId: string) {
    const deliverableItemId =
      await this.deliverableItemsService.resolvePublicId(publicId);

    const deliverableItem =
      await this.deliverableItemsService.findOneDeliverableItem(
        deliverableItemId,
      );

    return plainToInstance(DeliverableItemsEntity, deliverableItem);
  }
}
