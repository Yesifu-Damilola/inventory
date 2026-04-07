import { categoriesApi } from "@/services/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toastConfig";
import { DeleteCategoryResponse } from "@/types/categories";

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    DeleteCategoryResponse,
    Error,
    string
  >({
    mutationFn: (categoryId: string) =>
      categoriesApi.deleteCategory(categoryId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Category deleted successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.message || "Failed to delete category",
      });
    },
  });

  const onSubmit = (categoryId: string) => {
    mutate(categoryId);
  };

  return { isPending, onSubmit };
};
