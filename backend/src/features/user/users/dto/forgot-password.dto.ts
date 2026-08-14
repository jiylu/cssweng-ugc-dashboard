import { IsEmail } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmail({}, { message: 'Enter a valid email address.' })
  email!: string;
}
