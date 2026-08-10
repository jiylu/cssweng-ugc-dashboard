import { Exclude, Expose } from 'class-transformer';
import { UserRoles } from 'src/generated/prisma/enums';

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
