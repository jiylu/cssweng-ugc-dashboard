import { OmitType } from '@nestjs/swagger';
import { CreateDraftDto } from './create-draft.dto';

export class UpdateDraftDto extends OmitType(CreateDraftDto, [
  'userId',
] as const) {}
