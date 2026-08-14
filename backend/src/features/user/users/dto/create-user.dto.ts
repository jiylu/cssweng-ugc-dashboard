import { UserRoles } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @ApiProperty({ example: 'creator@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email!: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password!: string;

  @ApiProperty({ example: 'Alyssa' })
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName!: string;

  @ApiProperty({ example: 'Cruz' })
  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName!: string;

  @ApiProperty({ enum: UserRoles, example: UserRoles.CLIENT })
  @IsEnum(UserRoles, {
    message: 'Role must be a valid user role (CREATOR or CLIENT).',
  })
  role!: UserRoles;

  @ApiProperty({ description: 'Token returned after validating the email OTP' })
  @IsString()
  @IsNotEmpty()
  verificationToken!: string;
}
