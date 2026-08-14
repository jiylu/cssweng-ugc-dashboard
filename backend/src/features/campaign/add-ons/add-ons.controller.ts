import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AddOnsService } from './add-ons.service';
import { UpdateOptInDTO } from './dto/update-opt-in.dto';
import {
  ApiFindAddOnByPublicId,
  ApiFindAddOnsForCampaign,
  ApiUpdateAddOnOptIn,
} from './docs/add-ons.controller.swagger';
import { CampaignsService } from '../campaigns/campaigns.service';
import { plainToInstance } from 'class-transformer';
import { AddOnsEntity } from './entities/add-ons.entity';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { UserRoles } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('add-ons')
export class AddOnsController {
  constructor(
    private readonly addOnsService: AddOnsService,
    private readonly campaignsService: CampaignsService,
  ) {}

  @ApiFindAddOnByPublicId()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  async findOne(@Param('publicId') publicId: string) {
    const addOnId = await this.addOnsService.resolvePublicId(publicId);
    const addOn = await this.addOnsService.findOneAddOnByUID(addOnId);

    return plainToInstance(AddOnsEntity, addOn);
  }

  @ApiFindAddOnsForCampaign()
  @Get('/campaign/:publicId')
  @UseGuards(RolesGuard)
  async findMany(@Param('publicId') publicId: string) {
    const campaignId =
      await this.campaignsService.resolveCampaignPublicId(publicId);
    const addOns = await this.addOnsService.findAddOnsForCampaign(campaignId);

    return plainToInstance(AddOnsEntity, addOns);
  }

  @ApiUpdateAddOnOptIn()
  @Post('opt-in/:publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CLIENT)
  async optIn(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateOptInDTO,
  ) {
    const addOnId = await this.addOnsService.resolvePublicId(publicId);
    const addOn = await this.addOnsService.updateAddOnOptIn(addOnId, dto);

    return plainToInstance(AddOnsEntity, addOn);
  }
}
