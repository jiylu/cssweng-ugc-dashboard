import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LoginUserDTO {
  @ApiProperty({ example: 'client@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email!: string;

  @ApiProperty({ example: 'StrongPass123' })
  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password is required.' })
  @MinLength(6, { message: 'Password must be at least 6 characters.' })
  password!: string;

  @ApiPropertyOptional({
    example: true,
    description: 'If true, session cookie persists for a longer duration.',
  })
  @IsBoolean({ message: 'Remember me must be a boolean.' })
  @IsOptional()
  rememberMe?: boolean;

  @IsString()
  @Length(8, 8)
  @Matches(/^\d{8}$/)
  @IsOptional()
  otp?: string;
}
