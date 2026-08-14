import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GeneralTermsDTO {
  @Expose()
  @ApiProperty({ example: 'Laws of the Republic of the Philippines' })
  @IsString({ message: 'Governing law must be a string.' })
  @IsNotEmpty({ message: 'Governing law is required.' })
  @MaxLength(200, { message: 'Governing law must not exceed 200 characters.' })
  governed_by!: string;

  @Expose()
  @ApiProperty({ example: 'Makati City courts' })
  @IsString({ message: 'Dispute location must be a string.' })
  @IsNotEmpty({ message: 'Dispute location is required.' })
  @MaxLength(200, {
    message: 'Dispute location must not exceed 200 characters.',
  })
  disputes_handled_in!: string;
}
