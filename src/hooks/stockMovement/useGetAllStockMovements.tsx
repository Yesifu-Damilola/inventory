import { useQuery } from "@tanstack/react-query";
import { stockMovementsApi } from "@/services/api/stockMovements";
import type { Data as StockMovementRow } from "@/types/stockMovements";
import { getAllStockMovementQueryOptions } from "@/query/queryOptions/getAllStockMovement";

export const useGetAllStockMovements = () => {
  const { data: stockMovements = [], isPending: isPendingStockMovements } = useQuery({
    ...getAllStockMovementQueryOptions(),
    select: (data: any): StockMovementRow[] => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });

  return { stockMovements, isPendingStockMovements };
};
