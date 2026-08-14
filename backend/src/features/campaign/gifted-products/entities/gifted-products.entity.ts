import { Exclude, Expose, Type } from 'class-transformer';
import { ShippingAddressDTO } from '../dto/shipping-address.dto';

export class GiftedProductsEntity {
  @Expose()
  gifted_product_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  public_id: string;

  @Expose()
  product_name: string;

  @Expose()
  @Type(() => Number)
  value: number;

  @Expose()
  @Type(() => ShippingAddressDTO)
  shipping_address: ShippingAddressDTO;

  @Expose()
  delivery_instructions: string;

  @Expose()
  ownership_terms: string;

  @Exclude()
  is_deleted: boolean;
}
