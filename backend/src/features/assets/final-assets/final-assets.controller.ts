import { Controller } from '@nestjs/common';
import { FinalAssetsService } from './final-assets.service';

@Controller('final-assets')
export class FinalAssetsController {
  constructor(private readonly finalAssetsService: FinalAssetsService) {}
}
