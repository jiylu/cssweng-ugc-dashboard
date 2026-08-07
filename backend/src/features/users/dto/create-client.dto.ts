import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';
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

  @ApiProperty({ example: 1234567890 })
  @IsNumber()
  companyContactNumber!: number;

  @ApiProperty({ example: 9876543210 })
  @IsNumber()
  contactPersonContactNumber!: number;
}
