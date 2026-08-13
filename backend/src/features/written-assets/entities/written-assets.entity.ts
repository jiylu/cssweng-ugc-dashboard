import { AssetActions } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class WrittenAssetsEntity {
  @Exclude()
  written_asset_id: string;

  @Exclude()
  deliverable_item_id: string;

  @Expose()
  public_id: string;

  @Expose()
  @Type(() => Number)
  version_number: number;

  @Expose()
  content: string;

  @Expose()
  client_comments: string;

  @Expose()
  written_asset_action: AssetActions;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string | null;
}
