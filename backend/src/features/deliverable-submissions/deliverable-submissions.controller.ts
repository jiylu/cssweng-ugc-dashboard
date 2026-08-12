import { Controller } from '@nestjs/common';
import { DeliverableSubmissionsService } from './deliverable-submissions.service';

@Controller('deliverable-submissions')
export class DeliverableSubmissionsController {
  constructor(
    private readonly deliverableSubmissionsService: DeliverableSubmissionsService,
  ) {}
}
