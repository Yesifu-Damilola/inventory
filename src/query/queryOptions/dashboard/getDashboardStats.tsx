import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api/dashboard";
import { DASHBOARD_STATS_KEY } from "@/query/query-key/dashboard";

export const getDashboardStatsQueryOptions = () => {
    return queryOptions({
        queryKey: [DASHBOARD_STATS_KEY],
        queryFn: () => dashboardApi.getDashboardStats(),
    });
};