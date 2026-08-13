import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateGuestOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  proposalPublicId!: string;
}

export class ValidateGuestOtpDto extends CreateGuestOtpDto {
  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/)
  otp!: string;
}
