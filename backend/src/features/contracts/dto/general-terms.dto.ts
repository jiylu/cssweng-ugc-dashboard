import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GeneralTermsDTO {
  @ApiProperty({ example: 'Laws of the Republic of the Philippines' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  governed_by!: string;

  @ApiProperty({ example: 'Makati City courts' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  disputes_handled_in!: string;
}
