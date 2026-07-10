import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RevisionPolicyDTO {
  @ApiProperty({ example: 2 })
  @IsInt({ message: 'Revision rounds must be an integer.' })
  @Min(1, { message: 'Revision rounds must be at least 1.' })
  revision_rounds!: number;

  @ApiProperty({ example: 5 })
  @IsInt({ message: 'Revision window must be an integer (days).' })
  @Min(1, { message: 'Revision window must be at least 1 day.' })
  revision_window_days!: number;

  @ApiProperty({ example: 3 })
  @IsInt({ message: 'Auto-approve days must be an integer.' })
  @Min(1, { message: 'Auto-approve days must be at least 1.' })
  auto_approve_after_days!: number;
}
