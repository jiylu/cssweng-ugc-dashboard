import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { AddOnsService } from './add-ons.service';
import { UpdateOptInDTO } from './dto/update-opt-in.dto';
import {
  ApiFindAddOnByPublicId,
  ApiFindAddOnsForCampaign,
  ApiUpdateAddOnDetails,
  ApiUpdateAddOnOptIn,
} from './docs/add-ons.controller.swagger';
import { UpdateAddOnDTO } from './dto/update-add-on.dto';

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
  @Post('opt-in/:addOnId')
  optIn(@Param('addOnId') addOnId: string, @Body() dto: UpdateOptInDTO) {
    return this.addOnsService.updateAddOnOptIn(addOnId, dto);
  }

  @ApiUpdateAddOnDetails()
  @Patch(':addOnId')
  updateDetails(@Param('addOnId') addOnId: string, @Body() dto: UpdateAddOnDTO) {
    return this.addOnsService.updateAddOnDetails(addOnId, dto);
  }
}
