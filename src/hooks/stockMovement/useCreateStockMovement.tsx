import { stockMovementsApi } from "@/services/api/stockMovements";
import {
  CreateStockMovementPayload,
  CreateStockMovementResponse,
} from "@/types/stockMovements";
import { showToast } from "@/utils/toastConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateStockMovement = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    CreateStockMovementResponse,
    Error,
    CreateStockMovementPayload
  >({
    mutationFn: (payload) => stockMovementsApi.createStockMovement(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["stock-movements"] });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Stock movement created successfully",
      });
    },

    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg:
          error?.response?.data?.message || "Failed to create stock movement",
      });
    },
  });
  return { mutate, isPending };
};
