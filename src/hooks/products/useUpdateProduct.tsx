"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productsApi } from "@/services/api/products";
import type {
  UpdateProductsPayload,
  UpdateProductsResponse,
} from "@/types/products";
import { getErrorMessage } from "@/utils/errorHandler";
import { showToast } from "@/utils/toastConfig";

export const useUpdateProduct = (productId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    UpdateProductsResponse,
    Error,
    UpdateProductsPayload
  >({
    mutationFn: (payload: UpdateProductsPayload) =>
      productsApi.updateProduct(productId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["product", productId] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast({
        type: "SUCCESS",
        msg: data.message || "Product updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg:
          error?.response?.data?.message ||
          getErrorMessage(error) ||
          "Failed to update product",
      });
    },
  });

  return { mutate, isPending };
};
