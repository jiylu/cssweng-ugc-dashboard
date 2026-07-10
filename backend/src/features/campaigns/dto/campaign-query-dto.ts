import {
  IsOptional,
  IsString,
  IsInt,
  Min,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CampaignQueryDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsNotEmpty({ message: 'Creator ID is required.' })
  @IsString({ message: 'Creator ID must be a string.' })
  creatorId!: string;

  @ApiProperty({ example: '2' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page must be an integer.' })
  @Min(1, { message: 'Page must be at least 1.' })
  page?: number;

  @ApiProperty({ example: '10' })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  limit?: number;

  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean({ message: 'Active only filter must be a boolean.' })
  @Transform(({ value }) => value === 'true')
  activeOnly?: boolean;
}
