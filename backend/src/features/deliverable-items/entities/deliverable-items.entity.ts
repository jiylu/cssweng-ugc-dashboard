import { DeliverableItemStatus } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class DeliverableItemsEntity {
  @Exclude()
  deliverable_item_id: string;

  @Exclude()
  deliverable_id: string;

  @Expose()
  public_id: string;

  @Expose()
  @Type(() => Number)
  deliverable_index: number;

  @Expose()
  deliverable_item_status: DeliverableItemStatus;

  @Expose()
  written_asset_approved: boolean;

  @Expose()
  media_asset_approved: boolean;
}
