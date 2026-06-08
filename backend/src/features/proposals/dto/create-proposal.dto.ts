import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProposalDTO {
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @IsString()
  @IsNotEmpty()
  clientEmail!: string;
}
