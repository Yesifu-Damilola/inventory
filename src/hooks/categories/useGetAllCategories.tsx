import { categoriesApi } from "@/services/api/categories";
import { useQuery } from "@tanstack/react-query";
import type { Category } from "@/types/categories";

export const useGetAllCategories = () => {
  const { data: categories = [], isPending: isPendingCategories } = useQuery({
    queryKey: ["categories"],
    queryFn: categoriesApi.getAllCategories,
    select: (data: any): Category[] => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });

  return { categories, isPendingCategories };
};

