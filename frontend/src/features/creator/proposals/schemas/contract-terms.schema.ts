import z from "zod"
import { creativeDirectionSchema } from "./creative-direction.schema"
import { usageRightsSchema } from "./usage-rights.schema"
import { exclusivitySchema } from "./exclusivity.schema"
import { expensesSchema } from "./expenses.schema"
import { generalTermsSchema } from "./general-terms.schema"

export const contractTermsSchema = 
  creativeDirectionSchema
  .and(usageRightsSchema)
  .and(exclusivitySchema)
  .and(expensesSchema)
  .and(generalTermsSchema)