import { useQuery } from "@tanstack/react-query";
import { suppliersApi } from "@/services/api/suppliers";

/** Pass `undefined` when the route param is not ready yet. */
export const useGetSupplierById = (supplierId: string | undefined) => {
  const {
    data: supplier,
    isPending,
    error,
  } = useQuery({
    queryKey: ["supplier", supplierId],
    queryFn: () => suppliersApi.getSupplierById(supplierId!),
    enabled: Boolean(supplierId),
  });

  return { supplier, isPending, error };
};
