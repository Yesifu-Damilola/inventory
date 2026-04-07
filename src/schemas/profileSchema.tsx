import { z } from "zod";

export const ProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Full name is required")
    .max(100, "Full name is too long"),
  email: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .max(254, "Email is too long"),
});

export type ProfileSchemaType = z.infer<typeof ProfileSchema>;

