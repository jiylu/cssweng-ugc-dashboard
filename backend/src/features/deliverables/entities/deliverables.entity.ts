import { DeliverableType } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class DeliverablesEntity {
  @Exclude()
  deliverable_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
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
  pricing: number;

  @Exclude()
  is_deleted: boolean;
}
