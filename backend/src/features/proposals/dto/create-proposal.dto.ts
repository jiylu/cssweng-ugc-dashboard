import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'Campaign ID must be a string.' })
  @IsNotEmpty({ message: 'Campaign ID is required.' })
  campaignId!: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsString({ message: 'Client email must be a string.' })
  @IsNotEmpty({ message: 'Client email is required.' })
  clientEmail!: string;

  @ApiProperty({ example: 'Jane' })
  @IsString({ message: 'Client first name must be a string.' })
  @IsNotEmpty({ message: 'Client first name is required.' })
  client_first_name!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString({ message: 'Client last name must be a string.' })
  @IsNotEmpty({ message: 'Client last name is required.' })
  client_last_name!: string;
}
