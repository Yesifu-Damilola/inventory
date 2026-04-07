import { GetSuppliersParams, suppliersApi } from "@/services/api/suppliers";
import { useQuery } from "@tanstack/react-query";

export const useGetAllSuppliers = ({
  per_page = 10,
}: GetSuppliersParams = {}) => {
  const { data: suppliers = [], isPending: isPendingSuppliers } = useQuery({
    queryKey: ["suppliers", per_page],
    queryFn: () => suppliersApi.getAllSuppliers({ per_page }),
    select: (data) => data.data,
  });

  return { suppliers, isPendingSuppliers };
};
