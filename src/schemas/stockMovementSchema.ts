import { z } from "zod";

export const StockMovementSchema = z
  .object({
    product_id: z.string().trim().min(1, "Product is required"),
    type: z.enum(["purchase", "consumption", "waste", "adjustment", "return"]),
    quantity: z
      .number({
        invalid_type_error: "Quantity is required",
        required_error: "Quantity is required",
      })
      .finite("Quantity is required"),
    unit_cost: z
      .number({
        invalid_type_error: "Unit cost is required",
        required_error: "Unit cost is required",
      })
      .finite("Unit cost is required")
      .nonnegative("Unit cost cannot be negative"),
    reference_number: z.string().trim().min(1, "Reference is required"),
    occurred_at: z.string().optional(),
    notes: z.string().trim().optional().default(""),
  })
  .superRefine((val, ctx) => {
    const isStockIn = val.type === "purchase" || val.type === "adjustment";
    const isStockOut =
      val.type === "consumption" ||
      val.type === "waste" ||
      val.type === "return";

    if (isStockIn && val.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "Quantity must be greater than 0 for Purchase or Adjustment",
      });
    }

    if (isStockOut && val.quantity <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message:
          "Quantity must be greater than 0 for Consumption, Waste, or Return",
      });
    }

    if (val.type === "adjustment" && val.quantity === 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["quantity"],
        message: "Quantity cannot be 0 for Adjustment",
      });
    }
  });

export type StockMovementFormData = z.infer<typeof StockMovementSchema>;
