import { UserRoles } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class StoreSignatureDTO {
  @IsString()
  @IsNotEmpty()
  contractId!: string;

  @IsEnum(UserRoles)
  @IsNotEmpty()
  signerRole!: UserRoles;

  @IsString()
  @IsNotEmpty()
  signatureURL!: string;

  @IsString()
  @IsNotEmpty()
  initialsURL!: string;
}
