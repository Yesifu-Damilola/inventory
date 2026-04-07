import { useQuery } from "@tanstack/react-query";

import { getLowStockProductsQueryOptions } from "@/query/queryOptions/getLowStockProducts";
import type { LowStockProductRow, Product } from "@/types/products";

type ProductsListResponse = Product[] | { data?: Product[] };

const normalizeProductsResponse = (response: ProductsListResponse): Product[] => {
  if (Array.isArray(response)) return response;
  return Array.isArray(response.data) ? response.data : [];
};

const toLowStockRows = (products: Product[]): LowStockProductRow[] =>
  products.map((product) => ({
    id: String(product.id ?? ""),
    name: String(product.name ?? ""),
    sku: String(product.sku ?? ""),
    description: String(product.description ?? ""),
    category_id: String(product.category?.id ?? ""),
    unit_id: String(product.unit_of_measure?.id ?? ""),
    supplier_id: String(product.suppliers?.[0]?.id ?? ""),
    cost: Number(product.cost_price ?? 0),
    reorder_level: Number(product.reorder_level ?? 0),
    created_at: "",
    quantity_on_hand: Number(product.stock_level?.quantity_on_hand ?? 0),
  }));

type UseGetLowStockProductsOptions = {
  enabled?: boolean;
};

export const useGetLowStockProducts = (
  options?: UseGetLowStockProductsOptions,
) => {
  const { data: lowStockProducts = [], isPending: isPendingLowStock } = useQuery(
    {
      ...getLowStockProductsQueryOptions(),
      select: (response: ProductsListResponse): LowStockProductRow[] =>
        toLowStockRows(normalizeProductsResponse(response)),
      staleTime: 60_000,
      enabled: options?.enabled ?? true,
    },
  );

  return { lowStockProducts, isPendingLowStock };
};
