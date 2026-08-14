import { Exclude, Expose } from 'class-transformer';

export class FinalAssetsEntity {
  @Exclude()
  final_asset_id: string;

  @Exclude()
  deliverable_id: string;

  @Expose()
  public_id: string;

  @Expose()
  file_url: string;

  @Expose()
  created_at: string;
}
