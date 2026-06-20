import { z } from "zod";

export const registerSchema = z
  .object({
    fname: z
      .string()
      .min(1, "First name is required.")
      .min(2, "First name must atleast be 2 characters."),
    lname: z
      .string()
      .min(1, "Last name is required.")
      .min(2, "Last name must atleast be 2 characters."),
    email: z
      .string()
      .min(1, "Email is required")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Enter a valid email address"),
    password: z
      .string()
      .min(1, "Password is required")
      .min(6, "Password must be at least 6-20 characters")
      .max(20, "Password must be at least 6-20 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter.")
      .regex(/[0-9]/, "Password must contain at least one number.")
      .regex(
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/,
        "Password must contain at least one special character (!@#$%^&*)."
      ),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords do not match.",
        path: ["confirmPassword"],
      });
    }
  });
  