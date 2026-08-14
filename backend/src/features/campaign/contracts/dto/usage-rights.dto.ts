import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class UsageRightsDTO {
  @Expose()
  @ApiProperty({ example: true })
  @IsBoolean({ message: 'Exclusive flag must be a boolean.' })
  is_exclusive!: boolean;

  @Expose()
  @ApiProperty({ example: false })
  @IsBoolean({ message: 'Transferrable flag must be a boolean.' })
  is_transferrable!: boolean;

  @Expose()
  @ApiProperty({
    example:
      'Brand may use the content organically on social channels for 12 months after posting.',
  })
  @IsString({ message: 'Organic usage terms must be a string.' })
  @IsNotEmpty({ message: 'Organic usage terms are required.' })
  @MinLength(50, {
    message: 'Organic usage terms must be at least 50 characters.',
  })
  @MaxLength(500, {
    message: 'Organic usage terms must not exceed 500 characters.',
  })
  organic_usage!: string;

  @Expose()
  @ApiPropertyOptional({
    example:
      'Paid social boosting is allowed for up to 90 days from original post date.',
  })
  @IsString({ message: 'Paid usage terms must be a string.' })
  @IsOptional()
  @MinLength(50, {
    message: 'Paid usage terms must be at least 50 characters.',
  })
  @MaxLength(500, {
    message: 'Paid usage terms must not exceed 500 characters.',
  })
  paid_usage_ads?: string;

  @Expose()
  @ApiPropertyOptional({
    example:
      'Spark Ads may be run for 60 days provided ad copy is pre-approved by creator.',
  })
  @IsString({ message: 'Whitelisting terms must be a string.' })
  @IsOptional()
  @MinLength(50, {
    message: 'Whitelisting terms must be at least 50 characters.',
  })
  @MaxLength(500, {
    message: 'Whitelisting terms must not exceed 500 characters.',
  })
  whitelisting_spark_ads?: string;

  @Expose()
  @ApiProperty({ example: 'Philippines' })
  @IsString({ message: 'Territory must be a string.' })
  @IsNotEmpty({ message: 'Territory is required.' })
  @MaxLength(500, { message: 'Territory must not exceed 500 characters.' })
  territory!: string;

  @Expose()
  @ApiProperty({
    example: 'No use in political, gambling, or adult-content advertisements.',
  })
  @IsString({ message: 'Restrictions must be a string.' })
  @IsNotEmpty({ message: 'Restrictions are required.' })
  @MaxLength(500, { message: 'Restrictions must not exceed 500 characters.' })
  restrictions!: string;
}
