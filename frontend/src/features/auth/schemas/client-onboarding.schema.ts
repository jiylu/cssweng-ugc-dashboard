import { z } from "zod";

export const clientOnboardingSchema = z.object({
  companyLegalName: z.string().min(1, "Company legal name is required."),
  companyEmail: z.email("Enter a valid company email address."),
  companyAddress: z.string().min(1, "Company address is required."),
  companyPhoneNumber: z
    .string()
    .min(1, "Company phone number is required.")
    .regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid company phone number."),
  contactPerson: z.string().min(1, "Contact person is required."),
  contactNumber: z
    .string()
    .min(1, "Contact number is required.")
    .regex(/^[+\d][\d\s()-]{6,}$/, "Enter a valid contact number."),
  billablePerson: z.string().min(1, "Billable person is required."),
  billingEmail: z.email("Enter a valid billing email address."),
});
