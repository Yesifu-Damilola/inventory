import { dashboardApi } from "@/services/api/dashboard";
import { queryOptions } from "@tanstack/react-query";
import { DASHBOARD_STATS_KEY } from "@/query/query-key/dashboard";

export const getDashboardTopCategoriesQueryOptions = () => {
    return queryOptions({
        queryKey: [DASHBOARD_STATS_KEY, "top-categories"],
        queryFn: () => dashboardApi.getDashboardTopCategories()
    })
};