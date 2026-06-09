import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { UpdateDeliverableDTO } from './dto/update-deliverable.dto';
import {
  ApiFindDeliverable,
  ApiFindDeliverablesForCampaign,
  ApiUpdateDeliverable,
} from './docs/deliverables.controller.swagger';

@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @ApiFindDeliverable()
  @Get(':deliverableId')
  findOne(@Param('deliverableId') deliverableId: string) {
    return this.deliverablesService.findOneDeliverable(deliverableId);
  }

  @ApiFindDeliverablesForCampaign()
  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.deliverablesService.findDeliverablesForCampaign(campaignId);
  }

  @ApiUpdateDeliverable()
  @Patch(':deliverableId')
  update(
    @Param('deliverableId') deliverableId: string,
    @Body() dto: UpdateDeliverableDTO,
  ) {
    return this.deliverablesService.updateDeliverableDetails(
      deliverableId,
      dto,
    );
  }
}
