import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateProposalHistoryDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'Proposal ID must be a string.' })
  @IsNotEmpty({ message: 'Proposal ID is required.' })
  proposalId!: string;

  @ApiProperty({ example: { projectName: 'Campaign A' } })
  @IsObject({ message: 'Campaign content must be a JSON object.' })
  @IsNotEmpty({ message: 'Campaign content is required.' })
  campaignContent!: Prisma.InputJsonValue;

  @ApiProperty({ example: { clientEmail: 'client@example.com' } })
  @IsObject({ message: 'Proposal content must be a JSON object.' })
  @IsNotEmpty({ message: 'Proposal content is required.' })
  proposalContent!: Prisma.InputJsonValue;

  @ApiProperty({ example: [{ type: 'UGC', quantity: 3 }] })
  @IsObject({ message: 'Deliverable content must be a JSON object.' })
  @IsNotEmpty({ message: 'Deliverable content is required.' })
  deliverableContent!: Prisma.InputJsonValue;

  @ApiProperty({ example: { revisionPolicy: {} } })
  @IsObject({ message: 'Contract content must be a JSON object.' })
  @IsNotEmpty({ message: 'Contract content is required.' })
  contractContent!: Prisma.InputJsonValue;

  @ApiProperty({ example: [{ addOnName: 'Rush delivery' }] })
  @IsObject({ message: 'Add-ons content must be a JSON object.' })
  @IsNotEmpty({ message: 'Add-ons content is required.' })
  addOnsContent!: Prisma.InputJsonValue;

  @ApiProperty({ example: [{ productName: 'Sample Kit' }] })
  @IsObject({ message: 'Gifted products content must be a JSON object.' })
  @IsNotEmpty({ message: 'Gifted products content is required.' })
  giftedProductsContent!: Prisma.InputJsonValue;
}
