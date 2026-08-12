import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitWrittenAssetDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'Deliverable item ID must be a string.' })
  @IsNotEmpty({ message: 'Deliverable item ID is required.' })
  deliverableItemId!: string;

  @ApiProperty({ example: 'Caption copy and hashtags for the post.' })
  @IsString({ message: 'Content must be a string.' })
  @IsNotEmpty({ message: 'Content is required.' })
  content!: string;
}
