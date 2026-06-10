import { IsString, IsBoolean, IsEnum } from 'class-validator';
import { EntityType, Action, DeliverableType } from '@prisma/client';

export class CreateActivityLogDto {
  @IsString()
  userId: string;

  @IsString()
  targetUserId: string;

  @IsEnum(EntityType)
  entityType: EntityType;

  @IsString()
  entityId: string;

  @IsEnum(Action)
  action: Action;

  @IsEnum(DeliverableType)
  title: DeliverableType;

  @IsString()
  message: string;

  @IsBoolean()
  isRead: boolean;
}