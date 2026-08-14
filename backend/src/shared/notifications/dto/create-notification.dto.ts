import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export const NOTIFICATION_CATEGORIES = [
  'PROPOSAL',
  'CONTRACT',
  'DELIVERABLE',
  'PAYMENT',
] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

export class CreateNotificationDTO {
  @IsOptional()
  @IsIn(NOTIFICATION_CATEGORIES)
  category?: NotificationCategory;

  @ApiProperty({
    description:
      'ID of the recipient user who will receive the notification. Must reference an existing active user.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString({ message: 'User ID must be a string.' })
  @IsNotEmpty({ message: 'User ID is required.' })
  userId!: string;

  @ApiProperty({
    description:
      'Short notification heading shown in notification lists and unread badges.',
    example: 'Proposal Received',
    maxLength: 150,
  })
  @IsString({ message: 'Title must be a string.' })
  @IsNotEmpty({ message: 'Title is required.' })
  @MaxLength(150, { message: 'Title must not exceed 150 characters.' })
  title!: string;

  @ApiProperty({
    description:
      'Detailed notification body content shown when the notification is opened.',
    example:
      'You received a new campaign proposal from a creator. Open your dashboard to review details.',
    maxLength: 1000,
  })
  @IsString({ message: 'Message must be a string.' })
  @IsNotEmpty({ message: 'Message is required.' })
  @MaxLength(1000, { message: 'Message must not exceed 1000 characters.' })
  message!: string;
}
