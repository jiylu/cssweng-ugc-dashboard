import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class FindNotificationsQueryDTO {
  @IsNotEmpty()
  @IsString()
  userId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
