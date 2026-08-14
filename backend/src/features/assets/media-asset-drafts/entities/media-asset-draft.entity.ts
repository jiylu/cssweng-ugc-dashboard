import { Exclude, Expose } from 'class-transformer';

export class MediaAssetDraftEntity {
  @Exclude()
  media_asset_draft_id!: string;

  @Exclude()
  media_asset_id!: string;

  @Expose()
  public_id!: string;

  @Expose()
  content_url!: string;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date | null;
}
