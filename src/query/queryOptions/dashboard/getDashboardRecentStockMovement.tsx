import { dashboardApi } from "@/services/api/dashboard";
import { queryOptions } from "@tanstack/react-query";
import { DASHBOARD_RECENT_STOCK_MOVEMENTS_KEY } from "@/query/query-key/dashboard";

export const getDashboardRecentStockMovementsQueryOptions = () => {
    return queryOptions({
        queryKey: [DASHBOARD_RECENT_STOCK_MOVEMENTS_KEY],
        queryFn: async () => dashboardApi.getDashboardRecentStockMovements(),
    });
};