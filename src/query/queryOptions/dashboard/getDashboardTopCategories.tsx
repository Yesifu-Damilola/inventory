import { dashboardApi } from "@/services/api/dashboard";
import { queryOptions } from "@tanstack/react-query";

export const getDashboardTopCategoriesQueryOptions = () => {
    return queryOptions({
        queryKey: ["dashboard-stats"],
        queryFn: () => dashboardApi.getDashboardTopCategories()
    })
};