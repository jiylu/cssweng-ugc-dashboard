import { Exclude, Expose } from 'class-transformer';

export class InvoiceEntity {
  @Exclude()
  invoice_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  invoice_url: string;

  @Expose()
  created_at: string;
}
