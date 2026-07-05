import { IsBoolean } from 'class-validator';

export class UpdateOptInDTO {
  @IsBoolean()
  optIn!: boolean;
}
