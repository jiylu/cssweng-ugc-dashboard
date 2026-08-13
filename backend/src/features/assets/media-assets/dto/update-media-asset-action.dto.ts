import { ApiProperty } from '@nestjs/swagger';
import { AssetActions } from '@prisma/client';
import { IsEnum, IsIn, IsNotEmpty } from 'class-validator';

export class UpdateMediaAssetActionDTO {
  @ApiProperty({
    enum: [AssetActions.REVISE, AssetActions.APPROVE],
    example: AssetActions.APPROVE,
  })
  @IsEnum(AssetActions, {
    message: 'Action must be a valid AssetActions value.',
  })
  @IsIn([AssetActions.REVISE, AssetActions.APPROVE], {
    message: 'Action must be REVISE or APPROVE.',
  })
  @IsNotEmpty({ message: 'Action is required.' })
  action!: AssetActions;
}
