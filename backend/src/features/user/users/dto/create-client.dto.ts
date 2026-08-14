import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClientDTO {
  @ApiProperty({ example: 'abc123' })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({ example: 'Asceoft Marketing Inc.' })
  @IsString()
  @IsNotEmpty()
  companyLegalName!: string;

  @ApiProperty({ example: 'finance@client.com' })
  @IsEmail()
  companyEmail!: string;

  @ApiProperty({ example: 'Maria Santos' })
  @IsString()
  @IsNotEmpty()
  billablePerson!: string;

  @ApiProperty({ example: 'Juan Dela Cruz' })
  @IsString()
  @IsNotEmpty()
  contactPerson!: string;

  @ApiProperty({ example: '639429459448' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'companyContactNumber must contain only numbers',
  })
  companyContactNumber!: string;

  @ApiProperty({ example: '639876543210' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, {
    message: 'contactPersonContactNumber must contain only numbers',
  })
  contactPersonContactNumber!: string;
}
