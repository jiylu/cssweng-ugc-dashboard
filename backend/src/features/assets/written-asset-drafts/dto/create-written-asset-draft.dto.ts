import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWrittenAssetDraftDto {
  @ApiProperty({ example: 'x21E9dlf0F' })
  @IsString({ message: 'Deliverable item public ID must be a string.' })
  @IsNotEmpty({ message: 'Deliverable item public ID is required.' })
  deliverableItemPublicId!: string;

  @ApiProperty({ example: 'Draft content...' })
  @IsString({ message: 'Content must be a string.' })
  @IsNotEmpty({ message: 'Content is required.' })
  content!: string;
}
