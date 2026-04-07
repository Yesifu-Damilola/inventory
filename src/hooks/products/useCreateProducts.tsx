import { useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/services/api/products";
import {
  CreateProductsPayload,
  CreateProductsResponse,
} from "@/types/products";
import { showToast } from "@/utils/toastConfig";
import { getErrorMessage } from "@/utils/errorHandler";

export const useCreateProducts = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    CreateProductsResponse,
    Error,
    CreateProductsPayload
  >({
    mutationFn: (payload) => productsApi.createProducts(payload),

    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });

      showToast({
        type: "SUCCESS",
        msg: data.message || "Product created successfully",
      });
    },

    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      showToast({
        type: "ERROR",
        msg:
          error?.response?.data?.message ||
          (error?.response?.data
            ? JSON.stringify(error.response.data)
            : undefined) ||
          (typeof (error as any)?.response?.status === "number"
            ? `Request failed (status ${(error as any).response.status}).`
            : undefined) ||
          getErrorMessage(error) ||
          "Failed to create product",
      });
    },
  });

  return { mutate, isPending };
};
