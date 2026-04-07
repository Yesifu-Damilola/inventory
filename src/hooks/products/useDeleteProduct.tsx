"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { productsApi } from "@/services/api/products";
import { getErrorMessage } from "@/utils/errorHandler";
import { showToast } from "@/utils/toastConfig";

export const useDeleteProduct = (productId: string, onSuccess?: () => void) => {
  const queryClient = useQueryClient();

const { mutate, isPending } = useMutation({
    mutationFn: () => productsApi.deleteProduct(productId),
    onSuccess: (data: { message?: string }) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Product deleted successfully",
      });
      onSuccess?.();
    },
    onError: (err: Error & { response?: { data?: { message?: string } } }) => {
      showToast({
        type: "ERROR",
        msg:
          err?.response?.data?.message ||
          getErrorMessage(err) ||
          "Failed to delete product",
      });
    },
  });

  return { mutate, isPending };
};
