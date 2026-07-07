import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsageRightsDTO {
  @ApiProperty({ example: true })
  @IsBoolean()
  is_exclusive!: boolean;

  @ApiProperty({ example: false })
  @IsBoolean()
  is_transferrable!: boolean;

  @ApiProperty({
    example:
      'Brand may use the content organically on social channels for 12 months after posting.',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(500)
  organic_usage!: string;

  @ApiPropertyOptional({
    example:
      'Paid social boosting is allowed for up to 90 days from original post date.',
  })
  @IsString()
  @IsOptional()
  @MinLength(50)
  @MaxLength(500)
  paid_usage_ads?: string;

  @ApiPropertyOptional({
    example:
      'Spark Ads may be run for 60 days provided ad copy is pre-approved by creator.',
  })
  @IsString()
  @IsOptional()
  @MinLength(50)
  @MaxLength(500)
  whitelisting_spark_ads?: string;

  @ApiProperty({ example: 'Philippines' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  territory!: string;

  @ApiProperty({
    example: 'No use in political, gambling, or adult-content advertisements.',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  restrictions!: string;
}
