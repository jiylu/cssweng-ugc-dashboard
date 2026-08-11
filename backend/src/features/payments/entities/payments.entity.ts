import { Exclude, Expose, Type } from 'class-transformer';

export class PaymentsEntity {
  @Exclude()
  payment_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  proof_payment_url: string;

  @Expose()
  @Type(() => Number)
  payment_amt: number;

  @Expose()
  is_payment_verified: boolean;

  @Expose()
  created_at: string;

  @Expose()
  verified_at: string | null;
}
