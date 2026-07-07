import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class FindNotificationsQueryDTO {
  @ApiProperty({
    description:
      'ID of the user whose notifications should be retrieved. The user must exist and be active.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @ApiPropertyOptional({
    description:
      'Optional maximum number of notifications to return. Results are ordered newest first.',
    example: 10,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
