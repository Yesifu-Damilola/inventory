"use client";

import { AlertCircle, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetLowStockProducts } from "@/hooks/products/useGetLowStockProducts";

const toNumber = (value: number | string | null | undefined): number => {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
};

const LowStock = () => {
  const { lowStockProducts, isPendingLowStock } = useGetLowStockProducts({
    enabled: true,
  });
  const products = lowStockProducts.map((product) => ({
    ...product,
    quantityOnHand: toNumber(product.quantity_on_hand),
    reorderLevel: toNumber(product.reorder_level),
  }));

  const criticalCount = products.filter(
    (p) => p.quantityOnHand <= p.reorderLevel * 0.25,
  ).length;
  const warningCount = products.filter(
    (p) =>
      p.quantityOnHand > p.reorderLevel * 0.25 &&
      p.quantityOnHand <= p.reorderLevel,
  ).length;
  const isEmpty = !isPendingLowStock && products.length === 0;
  const summaryCardSkeleton = (
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-9 w-14" />
      <Skeleton className="h-3 w-40" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Low Stock Alerts</h1>
        <p className="text-muted-foreground">
          Monitor products below reorder levels
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-red-900 bg-red-900/10">
          <div className="flex items-center justify-between">
            {isPendingLowStock ? (
              summaryCardSkeleton
            ) : (
              <div>
                <p className="text-muted-foreground mb-1">Critical Stock</p>
                <p className="text-3xl font-bold text-red-500">
                  {criticalCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Below 25% of reorder level
                </p>
              </div>
            )}
            <AlertCircle className="w-10 h-10 text-red-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6 border-yellow-900 bg-yellow-900/10">
          <div className="flex items-center justify-between">
            {isPendingLowStock ? (
              summaryCardSkeleton
            ) : (
              <div>
                <p className="text-muted-foreground mb-1">Low Stock</p>
                <p className="text-3xl font-bold text-yellow-500">
                  {warningCount}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Below reorder level
                </p>
              </div>
            )}
            <TrendingDown className="w-10 h-10 text-yellow-500 opacity-20" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            {isPendingLowStock ? (
              summaryCardSkeleton
            ) : (
              <div>
                <p className="text-muted-foreground mb-1">Total Items</p>
                <p className="text-3xl font-bold">{lowStockProducts.length}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Requiring attention
                </p>
              </div>
            )}
            <AlertCircle className="w-10 h-10 text-primary opacity-20" />
          </div>
        </Card>
      </div>

      {/* Low Stock Products Table */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4">
          Products Requiring Reorder
        </h3>
        {isPendingLowStock ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-10 w-full" />
            ))}
          </div>
        ) : isEmpty ? (
          <div className="rounded-md border border-dashed border-border p-6 text-center text-muted-foreground">
            No low stock product found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Product</th>
                  <th className="px-6 py-3 text-left font-semibold">SKU</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Unit</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Current Qty
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Reorder Level
                  </th>
                  <th className="px-6 py-3 text-left font-semibold">Status</th>
                  <th className="px-6 py-3 text-left font-semibold">
                    Shortage
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const shortage = Math.max(
                    product.reorderLevel - product.quantityOnHand,
                    0,
                  );
                  const isCritical =
                    product.quantityOnHand <= product.reorderLevel * 0.25;
                  const statusColor = isCritical
                    ? "bg-red-900 text-red-200"
                    : "bg-yellow-900 text-yellow-200";
                  const statusLabel = isCritical ? "Critical" : "Low";

                  return (
                    <tr
                      key={product.id}
                      className="border-t border-border hover:bg-secondary/50"
                    >
                      <td className="px-6 py-4 font-medium">{product.name}</td>
                      <td className="px-6 py-4">{product.sku}</td>
                      <td className="px-6 py-4">
                        {product.category_name || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {product.unit_abbreviation
                          ? `${product.unit_name} (${product.unit_abbreviation})`
                          : product.unit_name || "-"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-red-500">
                        {product.quantityOnHand.toFixed(3)}
                      </td>
                      <td className="px-6 py-4">
                        {product.reorderLevel.toFixed(3)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                        >
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-red-500 font-semibold">
                        +{shortage.toFixed(3)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Information Card */}
      <Card className="p-6 bg-blue-900/10 border-blue-900">
        <div className="flex gap-4">
          <AlertCircle className="w-6 h-6 text-blue-500 mt-1" />
          <div>
            {isPendingLowStock ? (
              <div className="space-y-2">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-4 w-full max-w-[580px]" />
                <Skeleton className="h-4 w-full max-w-[520px]" />
              </div>
            ) : (
              <>
                <h4 className="font-semibold mb-2">Reorder Instructions</h4>
                <p className="text-sm text-muted-foreground">
                  Items listed above are below their reorder levels. Review
                  quantities and place orders with your suppliers to maintain
                  optimal inventory levels. Critical items (highlighted in red)
                  should be prioritized.
                </p>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LowStock;
