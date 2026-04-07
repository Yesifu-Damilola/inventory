import { stockMovementsApi } from "@/services/api/stockMovements";
import { queryOptions } from "@tanstack/react-query";

export const getStockMovementByIdQueryOptions = (stock_movementId: string) => {
  return queryOptions({
    queryKey: ["stock-movements", stock_movementId],
    queryFn: () => stockMovementsApi.getStockMovementById(stock_movementId),
    enabled: !!stock_movementId,
  });
};
