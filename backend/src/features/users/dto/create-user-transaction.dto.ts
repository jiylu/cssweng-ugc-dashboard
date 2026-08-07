import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger';
import { CreateUserDTO } from './create-user.dto';
import { CreateClientDTO } from './create-client.dto';

class CreateClientSetupDTO extends OmitType(CreateClientDTO, [
  'userId',
] as const) {}

export class CreateUserTransactionDTO {
  @ApiProperty({ type: () => CreateUserDTO })
  @ValidateNested()
  @Type(() => CreateUserDTO)
  userDTO!: CreateUserDTO;

  @ApiPropertyOptional({ type: () => CreateClientSetupDTO })
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateClientSetupDTO)
  clientDTO?: CreateClientSetupDTO;
}
