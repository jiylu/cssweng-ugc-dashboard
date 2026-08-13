import { Exclude, Expose, Type } from 'class-transformer';

export class AddOnsEntity {
  @Exclude()
  add_on_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  public_id: string;

  @Expose()
  add_on_name: string;

  @Expose()
  description: string;

  @Expose()
  @Type(() => Number)
  fee: number;

  @Expose()
  initials: string;

  @Exclude()
  is_deleted: boolean;

  @Expose()
  opt_in: boolean;
}
