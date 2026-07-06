import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { AddOnsService } from './add-ons.service';
import { UpdateOptInDTO } from './dto/update-opt-in.dto';
import {
  ApiFindAddOnByPublicId,
  ApiFindAddOnsForCampaign,
  ApiUpdateAddOnOptIn,
} from './docs/add-ons.controller.swagger';

@Controller('add-ons')
export class AddOnsController {
  constructor(private readonly addOnsService: AddOnsService) {}

  @ApiFindAddOnByPublicId()
  @Get(':publicId')
  findOne(@Param('publicId') publicId: string) {
    return this.addOnsService.findOneAddOnByPublicId(publicId);
  }

  @ApiFindAddOnsForCampaign()
  @Get('/campaign/:campaignId')
  findMany(@Param('campaignId') campaignId: string) {
    return this.addOnsService.findAddOnsForCampaign(campaignId);
  }

  @ApiUpdateAddOnOptIn()
  @Patch(':addOnId/opt-in')
  update(@Param('addOnId') addOnId: string, @Body() dto: UpdateOptInDTO) {
    return this.addOnsService.updateAddOnOptIn(addOnId, dto);
  }
}
