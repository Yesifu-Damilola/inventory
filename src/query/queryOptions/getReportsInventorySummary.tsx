import { reportsApi } from "@/services/api/reports";
import { queryOptions } from "@tanstack/react-query";

export const getReportsInventorySummaryQueryOptions = () => {
  return queryOptions({
    queryKey: ["reports-inventory-summary"],
    queryFn: () => reportsApi.getInventorySummary(),
  });
};
