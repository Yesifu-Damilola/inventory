import { z } from "zod";

export const UnitMeasureFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  abbreviation: z
    .string()
    .trim()
    .min(1, "Abbreviation is required")
    .max(32, "Abbreviation is too long"),
});

export type UnitMeasureFormData = z.infer<typeof UnitMeasureFormSchema>;
