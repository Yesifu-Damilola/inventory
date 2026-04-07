import { z } from "zod";

export const SupplierFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  contact_person: z
    .string()
    .trim()
    .min(1, "Contact person is required")
    .max(120, "Contact person is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Enter a valid email address")
    .max(255, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone is required")
    .max(40, "Phone is too long"),
  address: z
    .string()
    .trim()
    .min(1, "Address is required")
    .max(500, "Address is too long"),
  is_active: z.boolean(),
});

export type SupplierFormData = z.infer<typeof SupplierFormSchema>;
