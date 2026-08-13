import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDTO {
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain at least 8 characters.' })
  password!: string;
}
