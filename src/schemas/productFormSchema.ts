import { z } from "zod";

export const ProductFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(200, "Name is too long"),
  sku: z
    .string()
    .trim()
    .min(1, "SKU is required")
    .max(80, "SKU is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(2000, "Description is too long"),
  category: z.string().trim().min(1, "Category is required"),
  unit: z.string().trim().min(1, "Unit is required"),
  suppliers: z
    // Store supplier ids (not names) to avoid mismatches due to whitespace/casing.
    .array(z.string().min(1))
    .min(1, "Select at least one supplier"),
  cost_price: z
    .number({ invalid_type_error: "Enter a valid cost" })
    .refine(
      (n) => Number.isFinite(n) && n >= 0,
      "Cost must be a valid number 0 or greater",
    ),
  reorder_level: z
    .number({ invalid_type_error: "Enter a valid reorder level" })
    .refine(
      (n) =>
        Number.isFinite(n) &&
        Number.isInteger(n) &&
        n >= 0,
      "Reorder level must be a whole number 0 or greater",
    ),
  is_active: z.boolean(),
});

export type ProductFormData = z.infer<typeof ProductFormSchema>;
