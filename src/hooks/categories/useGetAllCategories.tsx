import { categoriesApi } from "@/services/api/categories";
import { useQuery } from "@tanstack/react-query";

export const useGetAllCategories = () => {
  const { data: categories = [], isPending: isPendingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAllCategories,
    select: (data) => data.data,
  });

  return { categories, isPendingCategories };
};
