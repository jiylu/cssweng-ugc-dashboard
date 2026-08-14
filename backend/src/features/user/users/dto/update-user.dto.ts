import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDTO {
  @ApiProperty({ example: 'creator@example.com' })
  @IsEmail({}, { message: 'Email must be a valid email address.' })
  @IsNotEmpty({ message: 'Email is required.' })
  email!: string;

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
}
