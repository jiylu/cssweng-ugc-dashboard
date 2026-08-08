import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDraftDto } from './dto/create-draft.dto';
import { nanoid } from 'nanoid';
import { UserService } from '../users/users.service';
import { UpdateDraftDto } from './dto/update-draft.dto';

@Injectable()
export class DraftsService {
  private readonly logger = new Logger(DraftsService.name);
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async createDraft(dto: CreateDraftDto) {
    this.logger.debug(`Creating draft for user ${dto.userId}`);

    const user = await this.userService.getActiveUserById(dto.userId);

    const publicId = nanoid(10);

    const draft = await this.prisma.drafts.create({
      data: {
        public_id: publicId,
        user_id: user.user_id,
        ...(dto.campaign && { campaign_content: dto.campaign }),
        ...(dto.proposal && { proposal_content: dto.proposal }),
        ...(dto.deliverables && { deliverable_content: dto.deliverables }),
        ...(dto.addOns && { add_ons_content: dto.addOns }),
        ...(dto.giftedProducts && {
          gifted_products_content: dto.giftedProducts,
        }),
        ...(dto.contract && { contract_content: dto.contract }),
      },
    });

    this.logger.log(`Created draft for user ${draft.user_id}`);

    return draft;
  }

  async resolvePublicId(publicId: string) {
    this.logger.log(`Resolving publicId ${publicId}`);

    const draft = await this.prisma.drafts.findFirst({
      where: {
        public_id: publicId,
        is_deleted: false,
      },
      select: {
        draft_id: true,
      },
    });

    if (!draft) {
      this.logger.warn(
        `Draft with publicId ${publicId} not found or is deleted.`,
      );

      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }
    this.logger.log(`Public id ${publicId} resolved: ${draft.draft_id}`);
    return draft.draft_id;
  }

  async findOneDraft(draftId: string) {
    this.logger.debug(`Finding draft with UID ${draftId}`);

    const draft = await this.prisma.drafts.findFirst({
      where: {
        draft_id: draftId,
        is_deleted: false,
      },
    });

    if (!draft) {
      this.logger.warn(`Draft ${draftId} not found.`);

      throw new NotFoundException({
        code: 'DRAFT_NOT_FOUND',
        message: 'Draft not found',
      });
    }

    this.logger.log(`Draft ${draftId} found.`);

    return draft;
  }

  async findDraftsForUser(userId: string) {
    this.logger.debug(`Finding drafts for user ${userId}`);

    const user = await this.userService.getActiveUserById(userId);

    const drafts = await this.prisma.drafts.findMany({
      where: {
        user_id: user.user_id,
        is_deleted: false,
      },
    });

    this.logger.log(`Found ${drafts.length} drafts for user ${user.user_id}.`);
    return drafts;
  }

  async updateDraft(draftId: string, dto: UpdateDraftDto) {
    this.logger.debug(`Updating draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const updatedDraft = await this.prisma.drafts.update({
      where: {
        draft_id: draft.draft_id,
      },
      data: {
        ...(dto.campaign !== undefined && {
          campaign_content: dto.campaign,
        }),
        ...(dto.proposal !== undefined && {
          proposal_content: dto.proposal,
        }),
        ...(dto.deliverables !== undefined && {
          deliverable_content: dto.deliverables,
        }),
        ...(dto.addOns !== undefined && {
          add_ons_content: dto.addOns,
        }),
        ...(dto.giftedProducts !== undefined && {
          gifted_products_content: dto.giftedProducts,
        }),
        ...(dto.contract !== undefined && {
          contract_content: dto.contract,
        }),
      },
    });

    this.logger.log(`Updated draft with UID ${draftId}`);

    return updatedDraft;
  }
  async deleteDraft(draftId: string) {
    this.logger.debug(`Deleting draft with UID ${draftId}`);

    const draft = await this.findOneDraft(draftId);

    const deletedDraft = await this.prisma.drafts.update({
      where: {
        draft_id: draft.draft_id,
      },
      data: {
        is_deleted: true,
      },
    });

    this.logger.log(`Deleted draft with UID ${draftId}`);

    return deletedDraft;
  }
}
