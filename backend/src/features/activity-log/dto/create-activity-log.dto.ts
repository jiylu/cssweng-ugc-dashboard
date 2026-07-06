import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EntityType, Action } from '@prisma/client';

export class CreateActivityLogDto {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEnum(EntityType)
  entityType!: EntityType;

  @IsString()
  entityId!: string;

  @IsEnum(Action)
  action!: Action;
}
