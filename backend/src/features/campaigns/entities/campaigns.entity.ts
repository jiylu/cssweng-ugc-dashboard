import {
  CampaignCurrency,
  CampaignStatus,
  PaymentSchedule,
} from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class CampaignsEntity {
  @Exclude()
  campaign_id: string;

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
  @Type(() => Number)
  tax: number;

  @Expose()
  @Type(() => Number)
  pricing: number;

  @Expose()
  platforms: object;

  @Expose()
  start_date: string;

  @Expose()
  end_date: string;

  @Expose()
  created_at: string;

  @Expose()
  campaign_status: CampaignStatus;

  @Expose()
  @Type(() => Number)
  paid_amount: number;

  @Expose()
  payment_schedule: PaymentSchedule;
}
