import { dashboardApi } from "@/services/api/dashboard";
import { queryOptions } from "@tanstack/react-query";
import { DASHBOARD_TOP_CATEGORIES_KEY } from "@/query/query-key/dashboard";

export const getDashboardTopCategoriesQueryOptions = () => {
    return queryOptions({
        queryKey: [DASHBOARD_TOP_CATEGORIES_KEY],
        queryFn: () => dashboardApi.getDashboardTopCategories()
    })
};