import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProposalDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  campaignId!: string;

  @ApiProperty({ example: 'client@example.com' })
  @IsString()
  @IsNotEmpty()
  clientEmail!: string;
}
