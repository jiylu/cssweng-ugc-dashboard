import { IsNotEmpty, IsString } from 'class-validator';

export class CreateContractDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;
}
