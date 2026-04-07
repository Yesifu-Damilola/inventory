import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/services/api/categories";

export const useGetCategoryById = (categoryId: string) => {
  const {
    data: category,
    isPending,
    error,
  } = useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => categoriesApi.getCategoryById(categoryId),
    enabled: !!categoryId,
  });

  return { category, isPending, error };
};
