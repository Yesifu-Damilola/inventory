import { z } from "zod";

export const CategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Category name is required")
    .max(100, "Category name is too long"),
  description: z
    .string()
    .trim()
    .min(1, "Description is required")
    .max(255, "Description is too long"),
});

export type CategoryFormData = z.infer<typeof CategorySchema>;
