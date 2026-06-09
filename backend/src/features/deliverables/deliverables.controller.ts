import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { DeliverablesService } from './deliverables.service';
import { UpdateDeliverableDTO } from './dto/update-deliverable.dto';

@Controller('deliverables')
export class DeliverablesController {
  constructor(private readonly deliverablesService: DeliverablesService) {}

  @Get(':deliverableId')
  findOne(@Param('deliverableId') deliverableId: string) {
    return this.deliverablesService.findOneDeliverable(deliverableId);
  }

  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.deliverablesService.findDeliverablesForCampaign(campaignId);
  }

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
