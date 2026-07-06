import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from 'class-validator';

export class PostingRequirementsDTO {
  @IsInt()
  @Min(1)
  content_retention_months!: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(250)
  partnership_tags!: string;
}
