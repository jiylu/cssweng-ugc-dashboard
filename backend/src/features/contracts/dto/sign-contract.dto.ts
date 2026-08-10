import { IsEnum } from 'class-validator';
import { UserRoles } from 'src/generated/prisma/enums';

export class SignContractDTO {
  @IsEnum(UserRoles)
  signerRole!: UserRoles;
}
