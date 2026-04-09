import { useQuery } from "@tanstack/react-query";

import { GetAllProductsParams, productsApi } from "@/services/api/products";
import type { Product, ProductRow } from "@/types/products";

type ProductsListResponse = Product[] | { data?: Product[] };

const toProductRows = (products: Product[]): ProductRow[] =>
  products.map((product) => ({
    id: String(product.id ?? ""),
    name: String(product.name ?? ""),
    sku: String(product.sku ?? ""),
    description: String(product.description ?? ""),
    category_id: String(product.category?.id ?? ""),
    category_name: String(product.category?.name ?? ""),
    unit_id: String(product.unit_of_measure?.id ?? ""),
    unit_name: String(product.unit_of_measure?.name ?? ""),
    unit_abbreviation: String(product.unit_of_measure?.abbreviation ?? ""),
    supplier_id: String(product.suppliers?.[0]?.id ?? ""),
    cost: Number(product.cost_price ?? 0),
    reorder_level: Number(product.reorder_level ?? 0),
    quantity_on_hand: Number(product.stock_level?.quantity_on_hand ?? 0),
    stock_last_updated_at: product.stock_level?.last_updated_at ?? null,
    is_active: Boolean(product.is_active),
    created_at: String(product.created_at ?? ""),
  }));

const normalizeProductsResponse = (response: ProductsListResponse): Product[] => {
  if (Array.isArray(response)) return response;
  return Array.isArray(response.data) ? response.data : [];
};

export const useGetAllProducts = (params?: GetAllProductsParams) => {
  const { data: products = [], isPending } = useQuery({
    // Include params in the key so each filter/search combination is cached independently.
    queryKey: ["products", params],
    queryFn: () => productsApi.getAllProducts(params) as Promise<ProductsListResponse>,
    select: (response): ProductRow[] => toProductRows(normalizeProductsResponse(response)),
    staleTime: 60_000,
  });

  return { products, isPendingProducts: isPending };
};

