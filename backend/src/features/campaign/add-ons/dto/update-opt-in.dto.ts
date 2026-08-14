import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateOptInDTO {
  @ApiProperty({
    example: true,
    description: 'Whether the add-on is selected for the campaign.',
  })
  @IsBoolean({ message: 'Opt-in must be a boolean value.' })
  optIn!: boolean;
}
