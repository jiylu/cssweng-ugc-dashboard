import { IsString, IsBoolean, IsEnum, IsNotEmpty } from 'class-validator';
import { EntityType, Action } from '@prisma/client';

export class CreateActivityLogDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsString()
  @IsNotEmpty()
  targetUserId?: string;

  @IsEnum(EntityType)
  entityType!: EntityType;

  @IsString()
  entityId!: string;

  @IsEnum(Action)
  action!: Action;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsBoolean()
  isRead?: boolean;
}
