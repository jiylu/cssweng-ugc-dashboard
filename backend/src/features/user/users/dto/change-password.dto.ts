import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ChangePasswordDTO {
  @IsString()
  @IsNotEmpty({ message: 'Current password is required.' })
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'Password must contain at least 8 characters.' })
  @Matches(/[A-Z]/, { message: 'Password must contain an uppercase letter.' })
  @Matches(/[a-z]/, { message: 'Password must contain a lowercase letter.' })
  @Matches(/[0-9]/, { message: 'Password must contain a number.' })
  @Matches(/[!@#$%^&*]/, {
    message: 'Password must contain a special character (!@#$%^&*).',
  })
  newPassword!: string;
}
