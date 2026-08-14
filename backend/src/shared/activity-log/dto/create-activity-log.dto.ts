import { IsString, IsEnum, IsNotEmpty } from 'class-validator';
import { EntityType, Action } from '@prisma/client';

export class CreateActivityLogDto {
  @IsString({ message: 'User ID must be a string.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId!: string;

  @IsEnum(EntityType, { message: 'Entity type must be a valid entity type.' })
  entityType!: EntityType;

  @IsString({ message: 'Entity ID must be a string.' })
  entityId!: string;

  @IsEnum(Action, { message: 'Action must be a valid action.' })
  action!: Action;
}
