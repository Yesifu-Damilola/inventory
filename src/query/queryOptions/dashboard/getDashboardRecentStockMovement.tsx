import { dashboardApi } from "@/services/api/dashboard";
import { queryOptions } from "@tanstack/react-query";

export const getDashboardRecentStockMovementsQueryOptions = () => {
    return queryOptions({
        queryKey: ["dashboard-stat"],
        queryFn: async () => dashboardApi.getDashboardRecentStockMovements(),
    });
};