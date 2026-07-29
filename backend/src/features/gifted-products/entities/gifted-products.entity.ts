import { Exclude, Expose, Type } from 'class-transformer';

export class GiftedProductsEntity {
  @Expose()
  gifted_product_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  product_name: string;

  @Expose()
  @Type(() => Number)
  value: number;

  @Expose()
  delivery_address: string;

  @Expose()
  delivery_instructions: string;

  @Expose()
  ownership_terms: string;

  @Exclude()
  is_deleted: boolean;
}
