import { queryOptions } from "@tanstack/react-query";
import { stockMovementsApi } from "@/services/api/stockMovements";

export const getAllStockMovementQueryOptions = () => {
  return queryOptions({
    queryKey: ["stock-movements", "list"],
    queryFn: () => stockMovementsApi.getAllStockMovements(),
  });
};
