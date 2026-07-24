import { Exclude, Expose, Type } from 'class-transformer';
import { RevisionPolicyDTO } from '../dto/revision-policy.dto';
import { UsageRightsDTO } from '../dto/usage-rights.dto';
import { PostingRequirementsDTO } from '../dto/posting-requirements.dto';
import { ExclusivityDTO } from '../dto/exclusivity.dto';
import { ExpensesPurchasesDTO } from '../dto/expenses-purchases.dto';
import { PaymentTermsDTO } from '../dto/payment-terms.dto';
import { InvoiceRequirementsDTO } from '../dto/invoice-requirements.dto';
import { GeneralTermsDTO } from '../dto/general-terms.dto';

export class ContractsEntity {
  @Exclude()
  contract_id: string;

  @Expose()
  public_id: string;

  @Exclude()
  campaign_id: string;

  @Expose()
  is_signed: boolean;

  @Expose()
  signed_at: string;

  @Expose()
  @Type(() => RevisionPolicyDTO)
  revision_policy: RevisionPolicyDTO;

  @Expose()
  @Type(() => UsageRightsDTO)
  usage_rights: UsageRightsDTO;

  @Expose()
  @Type(() => PostingRequirementsDTO)
  posting_requirements: PostingRequirementsDTO;

  @Expose()
  @Type(() => ExclusivityDTO)
  exclusivity: ExclusivityDTO | null;

  @Expose()
  @Type(() => ExpensesPurchasesDTO)
  expenses_purchases_terms: ExpensesPurchasesDTO | null;

  @Expose()
  cancellation_period: number;

  @Expose()
  @Type(() => PaymentTermsDTO)
  payment_terms: PaymentTermsDTO;

  @Expose()
  @Type(() => InvoiceRequirementsDTO)
  invoice_requirements: InvoiceRequirementsDTO;

  @Expose()
  @Type(() => GeneralTermsDTO)
  general_terms: GeneralTermsDTO;

  @Expose()
  extra_notes: string | null;
}
