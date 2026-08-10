import { ProposalStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ProposalsEntity {
  @Exclude()
  proposal_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  client_email: string;

  @Expose()
  client_first_name: string;

  @Expose()
  client_last_name: string;

  @Expose()
  client_comments: string;

  @Expose()
  proposal_status: ProposalStatus;
}
