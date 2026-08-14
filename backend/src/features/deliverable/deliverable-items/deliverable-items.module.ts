import { Module, forwardRef } from '@nestjs/common';
import { PrismaModule } from 'src/shared/prisma/prisma.module';
import { DeliverablesModule } from '../deliverables/deliverables.module';
import { DeliverableItemsService } from './deliverable-items.service';
import { DeliverableItemsController } from './deliverable-items.controller';

@Module({
  imports: [PrismaModule, forwardRef(() => DeliverablesModule)],
  providers: [DeliverableItemsService],
  controllers: [DeliverableItemsController],
  exports: [DeliverableItemsService],
})
export class DeliverableItemsModule {}
