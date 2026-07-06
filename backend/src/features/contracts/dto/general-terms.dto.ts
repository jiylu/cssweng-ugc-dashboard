import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class GeneralTermsDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  governed_by!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  disputes_handled_in!: string;
}
