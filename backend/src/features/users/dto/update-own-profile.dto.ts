import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateOwnProfileDTO {
  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name is required.' })
  @MaxLength(50, { message: 'First name must not exceed 50 characters.' })
  firstName!: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name is required.' })
  @MaxLength(50, { message: 'Last name must not exceed 50 characters.' })
  lastName!: string;
}
