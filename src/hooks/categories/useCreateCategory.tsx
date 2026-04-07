import { categoriesApi } from "@/services/api/categories";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  CreateCategoryPayload,
  CreateCategoryResponse,
} from "@/types/categories";
import { showToast } from "@/utils/toastConfig";
import { useRouter } from "next/navigation";
import { CategoryFormData } from "@/schemas/categorySchema";

export const useCreateCategory = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    CreateCategoryResponse,
    Error,
    CreateCategoryPayload
  >({
    mutationFn: categoriesApi.createCategory,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Category created successfully",
      });
      router.push("/categories");
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to create category",
      });
    },
  });

  const onSubmit = (formData: CategoryFormData) => {
    mutate({
      name: formData.name,
      description: formData.description,
      role: "admin",
    });
  };

  return { isPending, onSubmit };
};
