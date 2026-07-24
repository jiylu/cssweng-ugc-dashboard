import { CampaignCurrency, CampaignStatus } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class CampaignsEntity {
  @Exclude()
  contract_id: string;

  @Expose()
  public_id: string;

  @Expose()
  ugc_creator_id: string;

  @Expose()
  client_id: string | null;

  @Expose()
  project_name: string;

  @Expose()
  description: string;

  @Expose()
  currency: CampaignCurrency;

  @Expose()
  tax: number;

  @Expose()
  pricing: number;

  @Expose()
  platforms: string[];

  @Expose()
  start_date: string;

  @Expose()
  end_date: string;

  @Expose()
  created_at: string;

  @Expose()
  campaign_status: CampaignStatus;
}
