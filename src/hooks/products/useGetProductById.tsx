import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/services/api/products";

/** Pass `undefined` when the route param is not ready yet. */
export const useGetProductById = (productId: string | undefined) => {
  const {
    data: product,
    isPending,
    error,
  } = useQuery({
    queryKey: ["product", productId],
    queryFn: () => productsApi.getProductById(productId!),
    enabled: Boolean(productId),
  });

  return { product, isPending, error };
};
