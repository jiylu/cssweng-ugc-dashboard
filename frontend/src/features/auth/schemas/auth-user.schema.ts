import { z } from "zod";

const optionalProfileText = z
  .string()
  .nullish()
  .transform((value) => value ?? "");

export const authUserSchema = z.object({
  user_id: z.string().min(1),
  email: z.email(),
  first_name: z.string(),
  last_name: z.string(),
  middle_name: optionalProfileText,
  display_name: optionalProfileText,
  primary_handle: optionalProfileText,
  phone_number: optionalProfileText,
  profile_picture_url: z
    .string()
    .nullish()
    .transform(
      (value) =>
        value ||
        "https://www.clipartmax.com/png/full/449-4492509_lefroy-ice-breakers-minor-hockey-tournament-sorry-no-image-available.png",
    ),
  timezone: z
    .string()
    .nullish()
    .transform((value) => value || "Asia/Manila"),
  role: z.enum(["CLIENT", "CREATOR"]),
});

export type AuthUser = z.infer<typeof authUserSchema>;
