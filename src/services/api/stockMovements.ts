import {
  CreateStockMovementPayload,
  CreateStockMovementResponse,
  GetStockMovementByIdResponse,
} from "@/types/stockMovements";
import { axiosPrivate } from "../axios/axiosPrivate";

export const stockMovementsApi = {
  getAllStockMovements: async () => {
    const res = await axiosPrivate.get("/stock-movements");
    return res.data;
  },

  createStockMovement: async (
    payload: CreateStockMovementPayload,
  ): Promise<CreateStockMovementResponse> => {
    const res = await axiosPrivate.post<CreateStockMovementResponse>(
      "/stock-movements",
      payload,
    );
    return res.data;
  },

  getStockMovementById: async (
    stock_movementId: string,
  ): Promise<GetStockMovementByIdResponse> => {
    const res = await axiosPrivate.get<GetStockMovementByIdResponse>(
      `/stock-movements/${stock_movementId}`,
    );
    return res.data;
  },
};
