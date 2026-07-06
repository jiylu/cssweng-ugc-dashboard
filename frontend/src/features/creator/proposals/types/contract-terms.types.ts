import { CreativeDirectionData } from "./creative-direction.types"
import { UsageRightsData } from "./usage-rights.types"
import { ExclusivityData } from "./exclusivity.types"
import { ExpensesData } from "./expenses.types"
import { GeneralTermsData } from "./general-terms.types"

export interface ContractTermsData extends
  CreativeDirectionData,
  UsageRightsData,
  ExclusivityData,
  ExpensesData,
  GeneralTermsData {}