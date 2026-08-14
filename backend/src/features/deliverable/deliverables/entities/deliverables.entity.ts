import { DeliverableStatus, DeliverableType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class DeliverablesEntity {
  @Expose()
  deliverable_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  @Type(() => Number)
  quantity: number;

  @Expose()
  deliverable_type: DeliverableType;

  @Expose()
  deliverable_content: string;

  @Expose()
  requirements: string;

  @Expose()
  due_date: string;

  @Expose()
  post_date: string;

  @Expose()
  @Type(() => Number)
  pricing: number;

  @Expose()
  deliverable_status: DeliverableStatus;

  @Exclude()
  is_deleted: boolean;
}
