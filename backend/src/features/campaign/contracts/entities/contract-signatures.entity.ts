import { UserRoles } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export class ContractSignaturesEntity {
  @Exclude()
  signature_id: string;

  @Expose()
  contract_id: string;

  @Expose()
  signer_role: UserRoles;

  @Expose()
  signature_url: string;

  @Expose()
  initials_url: string;

  @Expose()
  signed_at: string;
}
