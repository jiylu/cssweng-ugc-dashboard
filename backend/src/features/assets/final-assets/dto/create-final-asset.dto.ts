import { ApiProperty } from '@nestjs/swagger';
import { ArrayNotEmpty, IsNotEmpty, IsString } from 'class-validator';

export class CreateFinalAssetDTO {
  @ApiProperty({ example: 'asd3-3dasuy-cxwhch-23akjsdas2-dsds' })
  @IsString({ message: 'Deliverable ID must be a string.' })
  @IsNotEmpty({ message: 'Deliverable ID is required.' })
  deliverableId!: string;

  @ApiProperty({ example: 'https://storage.example.com/assets/video.mp4' })
  @ArrayNotEmpty({ message: 'At least one file URL is required.' })
  @IsString({ each: true, message: 'Each file URL must be a string.' })
  fileUrl!: string;
}
