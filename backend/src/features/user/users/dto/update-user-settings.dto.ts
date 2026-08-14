import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserSettingsDTO {
  @IsOptional()
  @IsBoolean()
  twoFactorEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  emailProposalUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  emailContractUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  emailDeliverableUpdates?: boolean;

  @IsOptional()
  @IsBoolean()
  emailPaymentUpdates?: boolean;
}
