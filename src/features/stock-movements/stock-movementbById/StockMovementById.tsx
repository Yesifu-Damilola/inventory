"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getStockMovementByIdQueryOptions } from "@/query/queryOptions/getStockMovementById";
import { dateFormatter } from "@/utils/dateFormatter";

export default function StockMovementById() {
  const params = useParams();
  const stockMovementId = params?.stockmovementId as string;
  const { data, isPending, error } = useQuery(
    getStockMovementByIdQueryOptions(stockMovementId),
  );

  const movement = data?.data;

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

  const formatMoney = (value: string | undefined) => {
    if (value == null || value === "") return "—";
    const n = Number(value);
    if (Number.isNaN(n)) return value;
    return n.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  if (isPending) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-9 w-72" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-56" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
          <div className="space-y-6">
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div className="space-y-4 rounded-lg border border-border p-6">
              <Skeleton className="h-6 w-28" />
              <Skeleton className="h-10 w-16" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!movement) {
    return <div>Stock movement not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/stock-movements">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Stock Movement</h1>
          <p className="mt-1 text-muted-foreground">
            Reference: {movement.reference_number || "—"}
          </p>
        </div>
        <span
          className={`rounded px-2 py-1 text-xs font-medium ${getTypeColor(movement.type)}`}
        >
          {movement.type.charAt(0).toUpperCase() + movement.type.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Movement details</h3>
            <div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="mb-1 text-muted-foreground">Product</p>
                <p className="text-foreground">{movement.product?.name || "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">SKU</p>
                <p className="text-foreground">{movement.product?.sku || "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Quantity</p>
                <p className="text-foreground">{movement.quantity}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Unit cost</p>
                <p className="text-foreground">{formatMoney(movement.unit_cost)}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Occurred at</p>
                <p className="text-foreground">
                  {movement.occurred_at ? dateFormatter(movement.occurred_at) : "—"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Created at</p>
                <p className="text-foreground">
                  {movement.created_at ? dateFormatter(movement.created_at) : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Notes</h3>
            <p className="text-sm text-muted-foreground">
              {movement.notes || "No notes for this movement."}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">Movement ID</p>
                <p className="font-mono text-foreground">{movement.id}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Product ID</p>
                <p className="font-mono text-foreground">{movement.product?.id || "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">Recorded by</p>
                <p className="text-foreground">{movement.user?.name || "—"}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">User email</p>
                <p className="text-foreground">{movement.user?.email || "—"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border p-6">
            <h3 className="mb-4 text-lg font-semibold">Stock impact</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="mb-1 text-muted-foreground">Before</p>
                <p className="text-3xl font-bold">{movement.quantity_before}</p>
              </div>
              <div>
                <p className="mb-1 text-muted-foreground">After</p>
                <p className="text-2xl font-bold">{movement.quantity_after}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
