import { IsDataURI, IsString, MaxLength, MinLength } from 'class-validator';

export class SignContractDTO {
  @IsString()
  @MinLength(1)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(100)
  lastName: string;

  @IsDataURI()
  @MaxLength(500_000)
  signatureDataUrl: string;

  @IsDataURI()
  @MaxLength(150_000)
  initialsDataUrl: string;
}
