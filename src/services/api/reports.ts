import { axiosPrivate } from "../axios/axiosPrivate";

export const reportsApi = {
  getInventorySummary: async () => {
    const res = await axiosPrivate.get("/reports/inventory-summary");
    return res.data;
  },
  getStockValue: async () => {
    const res = await axiosPrivate.get("/reports/stock-value");
    return res.data;
  },
};
