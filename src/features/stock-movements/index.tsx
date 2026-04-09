"use client";

import Link from "next/link";
import { useState } from "react";
import { Plus } from "lucide-react";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateStockMovement } from "@/hooks/stockMovement/useCreateStockMovement";
import {
  StockMovementSchema,
  type StockMovementFormData,
} from "@/schemas/stockMovementSchema";
import { Controller, useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { getAllStockMovementQueryOptions } from "@/query/queryOptions/getAllStockMovement";
import { useGetAllProducts } from "@/hooks/products/useGetAllProducts";
import { dateFormatter } from "@/utils/dateFormatter";
import type { Data as StockMovementRow } from "@/types/stockMovements";

const StockMovements = () => {
  const { data: stockMovements, isPending: isPendingStockMovements } = useQuery(
    getAllStockMovementQueryOptions(),
  );
  const { products: productOptions, isPendingProducts } = useGetAllProducts({
    per_page: 10,
  });
  const {
    mutate: createStockMovement,
    isPending: isPendingCreateStockMovement,
  } = useCreateStockMovement();

  const [showModal, setShowModal] = useState(false);

  const defaultValues: StockMovementFormData = {
    product_id: "",
    type: "purchase",
    quantity: 0.002,
    unit_cost: 2000,
    reference_number: "stringss",
    notes: "strings here",
    occurred_at: new Date().toISOString(),
  };

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(StockMovementSchema),
    defaultValues,
  });

  const handleOpenModal = () => {
    reset(defaultValues);
    setShowModal(true);
  };

  const onSubmit = (values: StockMovementFormData) => {
    createStockMovement(
      {
        product_id: values.product_id,
        type: values.type,
        quantity: values.quantity,
        unit_cost: values.unit_cost,
        reference_number: values.reference_number,
        notes: values.notes ?? "",
        occurred_at: values.occurred_at || new Date().toISOString(),
      },
      { onSuccess: () => setShowModal(false) },
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
      case "in":
        return "bg-green-900 text-green-200";
      case "sale":
      case "out":
        return "bg-red-900 text-red-200";
      case "consumption":
      case "waste":
        return "bg-orange-900 text-orange-200";
      case "adjustment":
        return "bg-yellow-900 text-yellow-200";
      case "return":
        return "bg-blue-900 text-blue-200";
      default:
        return "bg-gray-700 text-gray-200";
    }
  };

  const metricBadgeClass =
    "inline-flex px-2 py-1 rounded text-sm font-medium tabular-nums whitespace-nowrap";

  const formatMoney = (value: string | undefined) => {
    if (value == null || value === "") return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const skeletonRows = Array.from({ length: 6 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stock Movements</h1>
          <p className="text-muted-foreground">
            Track inventory movements and adjustments
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Movement
        </Button>
      </div>

      <div className="rounded-lg border border-border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Product
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Type
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Quantity
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Qty before
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Qty after
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Unit cost
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Reference
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Notes
              </th>
              <th className="px-6 py-3 text-left font-semibold whitespace-nowrap">
                Date
              </th>
              <th className="px-6 py-3 text-right font-semibold whitespace-nowrap">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isPendingStockMovements &&
              skeletonRows.map((_, rowIndex) => (
                <tr key={rowIndex} className="border-t border-border">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-[min(100%,180px)] max-w-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-14" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-12 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32 max-w-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32 max-w-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-28" />
                  </td>
                </tr>
              ))}
            {!isPendingStockMovements &&
              stockMovements?.data?.map((movement: StockMovementRow) => (
                <tr
                  key={movement.id}
                  className="border-t border-border hover:bg-secondary/50"
                >
                  <td className="px-6 py-4 font-medium">
                    {movement?.product?.name ?? "—"}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${getTypeColor(movement.type)}`}
                    >
                      {movement.type.charAt(0).toUpperCase() +
                        movement.type.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 tabular-nums">
                    {movement.quantity}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${metricBadgeClass} bg-sky-900 text-sky-200`}
                    >
                      {movement.quantity_before ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${metricBadgeClass} bg-emerald-900 text-emerald-200`}
                    >
                      {movement.quantity_after ?? "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`${metricBadgeClass} bg-violet-900 text-violet-200`}
                    >
                      {formatMoney(movement.unit_cost)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {movement.reference_number ?? "—"}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {movement.notes}
                  </td>
                  <td className="px-6 py-4">
                    {dateFormatter(movement.created_at)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/stock-movements/${movement.id}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Record Stock Movement"
        className="max-w-[725px]"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Product</label>
            <Controller
              control={control}
              name="product_id"
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  disabled={isPendingProducts}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="">
                    {isPendingProducts
                      ? "Loading products…"
                      : "Select a product"}
                  </option>
                  {productOptions.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name || "—"}
                      {product.sku ? ` (${product.sku})` : ""}
                    </option>
                  ))}
                </select>
              )}
            />
            {errors.product_id?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.product_id.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Type</label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <select
                  value={field.value}
                  onChange={(e) =>
                    field.onChange(
                      e.target.value as StockMovementFormData["type"],
                    )
                  }
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground"
                >
                  <option value="purchase">Purchase</option>
                  <option value="consumption">Consumption</option>
                  <option value="waste">Waste</option>
                  <option value="adjustment">Adjustment</option>
                  <option value="return">Return</option>
                </select>
              )}
            />
            {errors.type?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.type.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <Controller
              control={control}
              name="quantity"
              render={({ field }) => (
                <Input
                  type="number"
                  step="any"
                  value={field.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const next = raw === "" ? 0 : Number(raw);
                    field.onChange(next);
                  }}
                  placeholder="Quantity"
                  aria-invalid={!!errors.quantity}
                />
              )}
            />
            {errors.quantity?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.quantity.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Reference</label>
            <Controller
              control={control}
              name="reference_number"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="PO number or reference"
                  aria-invalid={!!errors.reference_number}
                />
              )}
            />
            {errors.reference_number?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.reference_number.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Unit Cost</label>
            <Controller
              control={control}
              name="unit_cost"
              render={({ field }) => (
                <Input
                  type="number"
                  step="any"
                  value={field.value}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const next = raw === "" ? 0 : Number(raw);
                    field.onChange(next);
                  }}
                  placeholder="Unit cost"
                  aria-invalid={!!errors.unit_cost}
                />
              )}
            />
            {errors.unit_cost?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.unit_cost.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                <Input
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Additional notes"
                  aria-invalid={!!errors.notes}
                />
              )}
            />
            {errors.notes?.message && (
              <p className="text-destructive text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPendingCreateStockMovement}>
              {isPendingCreateStockMovement ? "Saving..." : "Record"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StockMovements;
