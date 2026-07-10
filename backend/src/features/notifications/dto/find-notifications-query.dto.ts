import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class FindNotificationsQueryDTO {
  @ApiProperty({
    description:
      'ID of the user whose notifications should be retrieved. The user must exist and be active.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty({ message: 'User ID is required.' })
  @IsString({ message: 'User ID must be a string.' })
  userId!: string;

  @ApiPropertyOptional({
    description:
      'Optional maximum number of notifications to return. Results are ordered newest first.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt({ message: 'Limit must be an integer.' })
  @Min(1, { message: 'Limit must be at least 1.' })
  limit?: number;
}
