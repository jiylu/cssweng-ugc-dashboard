import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UsageRightsDTO {
  @IsBoolean()
  is_exclusive!: boolean;

  @IsBoolean()
  is_transferrable!: boolean;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(500)
  organic_usage!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(500)
  paid_usage_ads?: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(50)
  @MaxLength(500)
  whitelisting_spark_ads?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  territory!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  restrictions!: string;
}
