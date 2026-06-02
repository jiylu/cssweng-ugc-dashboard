import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

enum UserRoles {
  CLIENT = 'CLIENT',
  CREATOR = 'CREATOR',
}

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName!: string;

  @IsEnum(UserRoles)
  role!: UserRoles;
}
