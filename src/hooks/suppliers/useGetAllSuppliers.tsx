import { GetSuppliersParams, suppliersApi } from "@/services/api/suppliers";
import { useQuery } from "@tanstack/react-query";
import type { Supplier } from "@/types/suppliers";

export const useGetAllSuppliers = ({
  per_page = 10,
}: GetSuppliersParams = {}) => {
  const { data: suppliers = [], isPending: isPendingSuppliers } = useQuery({
    queryKey: ["suppliers", per_page],
    queryFn: () => suppliersApi.getAllSuppliers({ per_page }),
    select: (data: any): Supplier[] => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });

  return { suppliers, isPendingSuppliers };
};

