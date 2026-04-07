import { categoriesApi } from "@/services/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateCategoryResponse,
  UpdateCategoryPayload,
} from "@/types/categories";
import { showToast } from "@/utils/toastConfig";

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    UpdateCategoryResponse,
    Error,
    UpdateCategoryPayload
  >({
    mutationFn: (payload: UpdateCategoryPayload) =>
      categoriesApi.updateCategory(payload.id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Category updated successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to update category",
      });
    },
  });

  const onSubmit = (payload: UpdateCategoryPayload) => {
    mutate(payload);
  };

  return { onSubmit, isPending };
};
