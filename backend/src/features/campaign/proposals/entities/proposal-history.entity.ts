import { Prisma, ProposalActions } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ProposalHistoryEntity {
  @Exclude()
  history_id: string;

  @Exclude()
  proposal_id: string;

  @Expose()
  version_number: number;

  @Expose()
  campaign_content: Prisma.JsonValue;

  @Expose()
  proposal_content: Prisma.JsonValue;

  @Expose()
  deliverable_content: Prisma.JsonValue;

  @Expose()
  contract_content: Prisma.JsonValue;

  @Expose()
  add_ons_content: Prisma.JsonValue;

  @Expose()
  gifted_products_content: Prisma.JsonValue;

  @Expose()
  client_comments: string;

  @Expose()
  action: ProposalActions;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date | null;
}
