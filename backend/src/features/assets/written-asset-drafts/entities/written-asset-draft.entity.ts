import { Exclude, Expose } from 'class-transformer';

export class WrittenAssetDraftEntity {
  @Exclude()
  written_asset_draft_id!: string;

  @Exclude()
  deliverable_item_id!: string;

  @Exclude()
  written_asset_id!: string | null;

  @Expose()
  public_id!: string;

  @Expose()
  content!: string;

  @Expose()
  created_at!: Date;

  @Expose()
  updated_at!: Date | null;
}
