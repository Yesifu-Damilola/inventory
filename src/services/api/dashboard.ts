import { GetDashboardRecentStockMovementsResponse, GetDashboardStatsResponse, GetDashboardTopCategoriesResponse, GetDashboardInventoryByCategoryResponse } from "@/types/dashboard";
import { axiosPrivate } from "../axios/axiosPrivate";

export const dashboardApi = {
    // get dashboard stats 
    getDashboardStats: async (): Promise<GetDashboardStatsResponse> => {
        const res = await axiosPrivate.get<GetDashboardStatsResponse>("/dashboard/stats");
        return res.data;
    },
    // get recent stock movements
    getDashboardRecentStockMovements: async (): Promise<GetDashboardRecentStockMovementsResponse> => {
        const res = await axiosPrivate.get<GetDashboardRecentStockMovementsResponse>("/dashboard/recent-stock-movements");
        return res.data;
    },
    // get top categories
    getDashboardTopCategories: async (): Promise<GetDashboardTopCategoriesResponse> => {
        const res = await axiosPrivate.get<GetDashboardTopCategoriesResponse>("/dashboard/top-categories");
        return res.data;
    },
    // get inventory by category
    getDashboardInventoryByCategory: async (): Promise<GetDashboardInventoryByCategoryResponse> => {
        const res = await axiosPrivate.get<GetDashboardInventoryByCategoryResponse>("/dashboard/inventory-by-category");
        return res.data;
    }
};