import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DraftsService } from './drafts.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { plainToInstance } from 'class-transformer';
import { DraftsEntity } from './entities/drafts.entity';
import { UpdateDraftDto } from './dto/update-draft.dto';
import {
  ApiCreateDraft,
  ApiDeleteDraft,
  ApiFindDraft,
  ApiFindDraftsForUser,
  ApiUpdateDraft,
} from './docs/drafts.controller.swagger';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { UserRoles } from '@prisma/client';

@Controller('drafts')
export class DraftsController {
  constructor(private readonly draftsService: DraftsService) {}

  @ApiCreateDraft()
  @Post()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async create(@Body() dto: CreateDraftDto) {
    const draft = await this.draftsService.createDraft(dto);

    return plainToInstance(DraftsEntity, draft);
  }

  @ApiFindDraft()
  @Get(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findOne(@Param('publicId') publicId: string) {
    const draftId = await this.draftsService.resolvePublicId(publicId);
    const draft = await this.draftsService.findOneDraft(draftId);

    return plainToInstance(DraftsEntity, draft);
  }

  @ApiFindDraftsForUser()
  @Get()
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async findMany(@Query('userId') userId: string) {
    const drafts = await this.draftsService.findDraftsForUser(userId);

    return plainToInstance(DraftsEntity, drafts);
  }

  @ApiUpdateDraft()
  @Patch(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async update(
    @Param('publicId') publicId: string,
    @Body() dto: UpdateDraftDto,
  ) {
    const draftId = await this.draftsService.resolvePublicId(publicId);
    const updatedDraft = await this.draftsService.updateDraft(draftId, dto);

    return plainToInstance(DraftsEntity, updatedDraft);
  }

  @ApiDeleteDraft()
  @Delete(':publicId')
  @UseGuards(RolesGuard)
  @Roles(UserRoles.CREATOR)
  async remove(@Param('publicId') publicId: string) {
    const draftId = await this.draftsService.resolvePublicId(publicId);
    const deletedDraft = await this.draftsService.deleteDraft(draftId);

    return plainToInstance(DraftsEntity, deletedDraft);
  }
}
