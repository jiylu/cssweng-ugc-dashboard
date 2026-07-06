import { IsInt, Min } from 'class-validator';

export class RevisionPolicyDTO {
  @IsInt()
  @Min(1)
  revision_rounds!: number;

  @IsInt()
  @Min(1)
  revision_window_days!: number;

  @IsInt()
  @Min(1)
  auto_approve_after_days!: number;
}
