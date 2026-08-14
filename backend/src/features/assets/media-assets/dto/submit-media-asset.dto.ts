import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class SubmitMediaAssetDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString({ message: 'Deliverable item ID must be a string.' })
  @IsNotEmpty({ message: 'Deliverable item ID is required.' })
  deliverableItemId!: string;

  @ApiProperty({ example: 'https://storage.example.com/assets/post.mp4' })
  @IsString({ message: 'Content URL must be a string.' })
  @IsNotEmpty({ message: 'Content URL is required.' })
  content_url!: string;

  @ApiProperty({ example: true, description: 'Whether the asset is a video.' })
  @IsBoolean({ message: 'is_video must be a boolean.' })
  is_video!: boolean;
}
