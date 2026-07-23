import { GetDashboardInventoryByCategoryResponse } from "@/types/dashboard";
import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api/dashboard";
import { DASHBOARD_STATS_KEY } from "@/query/query-key/dashboard";

export const getDashboardInventoryByCategoryQueryOptions = () => {
    return queryOptions({
        queryKey: [DASHBOARD_STATS_KEY, "inventory-by-category"],
        queryFn: async () => dashboardApi.getDashboardInventoryByCategory(),
    });
};