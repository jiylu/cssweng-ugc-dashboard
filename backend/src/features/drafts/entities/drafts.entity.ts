import { Prisma } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class DraftsEntity {
  @Exclude()
  draft_id: string;

  @Expose()
  public_id: string;

  @Expose()
  user_id: string;

  @Expose()
  campaign_content: Prisma.JsonValue | null;

  @Expose()
  proposal_content: Prisma.JsonValue | null;

  @Expose()
  deliverable_content: Prisma.JsonValue | null;

  @Expose()
  contract_content: Prisma.JsonValue | null;

  @Expose()
  add_ons_content: Prisma.JsonValue | null;

  @Expose()
  gifted_products_content: Prisma.JsonValue | null;

  @Exclude()
  is_deleted: boolean;
}
