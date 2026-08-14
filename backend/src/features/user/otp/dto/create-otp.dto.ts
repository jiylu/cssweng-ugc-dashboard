import { UserRoles } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class CreateOtpDto {
  @IsEmail()
  email!: string;

  @IsEnum(UserRoles)
  role!: UserRoles;
}
