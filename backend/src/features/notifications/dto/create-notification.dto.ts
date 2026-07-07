import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateNotificationDTO {
  @ApiProperty({
    description:
      'ID of the recipient user who will receive the notification. Must reference an existing active user.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  userId!: string;

  @ApiProperty({
    description:
      'Short notification heading shown in notification lists and unread badges.',
    example: 'Proposal Received',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({
    description:
      'Detailed notification body content shown when the notification is opened.',
    example:
      'You received a new campaign proposal from a creator. Open your dashboard to review details.',
    maxLength: 1000,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  message!: string;
}
