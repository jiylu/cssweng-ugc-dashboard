import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SubmitWrittenAssetDTO {
  @ApiProperty({ example: 'a3SFgGh1_' })
  @IsString({ message: 'Deliverable item public ID must be a string.' })
  @IsNotEmpty({ message: 'Deliverable item public ID is required.' })
  deliverableItemPublicId!: string;

  @ApiProperty({ example: 'Caption copy and hashtags for the post.' })
  @IsString({ message: 'Content must be a string.' })
  @IsNotEmpty({ message: 'Content is required.' })
  content!: string;
}
