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
    unit_id: String(product.unit_of_measure?.id ?? ""),
    supplier_id: String(product.suppliers?.[0]?.id ?? ""),
    cost: Number(product.cost_price ?? 0),
    reorder_level: Number(product.reorder_level ?? 0),
    created_at: "",
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

