import { z } from "zod";

export const clientRegisterParamsSchema = z.object({
  email: z.email("Enter a valid email address").optional().catch(undefined),
  proposalId: z.string().min(1).optional().catch(undefined),
});
