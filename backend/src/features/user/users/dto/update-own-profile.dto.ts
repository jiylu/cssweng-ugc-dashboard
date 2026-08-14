import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class UpdateOwnProfileDTO {
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName!: string;

  @IsString()
  @MaxLength(50)
  middleName!: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  displayName!: string;

  @IsString()
  @Matches(/^(?:[a-zA-Z0-9._]{3,30})?$/, {
    message:
      'Primary handle must be 3-30 letters, numbers, dots, or underscores.',
  })
  primaryHandle!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^(?:\d{7,15})?$/, {
    message: 'Phone number must contain 7-15 digits.',
  })
  phoneNumber!: string;

  @IsIn(['Asia/Manila', 'Asia/Tokyo'])
  timezone!: string;
}
