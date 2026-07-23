import { queryOptions } from "@tanstack/react-query";
import { dashboardApi } from "@/services/api/dashboard";

export const getDashboardStatsQueryOptions = () => {
    return queryOptions({
        queryKey: ["dashboard-stats"],
        queryFn: () => dashboardApi.getDashboardStats(),
    });
};