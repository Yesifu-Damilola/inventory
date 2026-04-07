import { reportsApi } from "@/services/api/reports";
import { queryOptions } from "@tanstack/react-query";

export const getStockValueQueryOptions = () => {
  return queryOptions({
    queryKey: ["reports-stock-value"],
    queryFn: () => reportsApi.getStockValue(),
  });
};