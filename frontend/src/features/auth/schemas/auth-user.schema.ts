import { z } from "zod";

export const authUserSchema = z.object({
  user_id: z.string().min(1),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  role: z.enum(["CLIENT", "CREATOR"]),
});

export type AuthUser = z.infer<typeof authUserSchema>;
