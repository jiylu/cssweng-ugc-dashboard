import { UserRoles } from '@prisma/client';
import { IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';

export class ValidateOtpDto {
  @IsEmail()
  email!: string;

  @IsEnum(UserRoles)
  role!: UserRoles;

  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/)
  otp!: string;
}
