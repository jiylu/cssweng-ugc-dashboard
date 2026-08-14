import { AssetActions } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';

export class MediaAssetsEntity {
  @Exclude()
  media_asset_id: string;

  @Exclude()
  deliverable_item_id: string;

  @Expose()
  public_id: string;

  @Expose()
  @Type(() => Number)
  version_number: number;

  @Expose()
  is_video: boolean;

  @Expose()
  content_url: string;

  @Expose()
  client_comments: string;

  @Expose()
  media_asset_action: AssetActions;

  @Expose()
  created_at: string;

  @Expose()
  updated_at: string | null;
}
