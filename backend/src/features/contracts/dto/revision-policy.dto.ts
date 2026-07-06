import { IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RevisionPolicyDTO {
  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  revision_rounds!: number;

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  revision_window_days!: number;

  @ApiProperty({ example: 3 })
  @IsInt()
  @Min(1)
  auto_approve_after_days!: number;
}
