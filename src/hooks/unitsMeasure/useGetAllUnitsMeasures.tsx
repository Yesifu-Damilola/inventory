import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { useQuery } from "@tanstack/react-query";
import type { GetAllUnitsMeasuresData } from "@/types/unitsMeasure";

export const useGetAllUnitsMeasures = () => {
  const { data: unitsMeasures = [], isPending: isLoadingUnitsMeasures } = useQuery({
    queryKey: ["unitsMeasures"],
    queryFn: unitsMeaureApi.getAllUnitsMeasures,
    select: (data: any): GetAllUnitsMeasuresData[] => {
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.data)) return data.data;
      if (Array.isArray(data?.data?.data)) return data.data.data;
      return [];
    },
  });

  return { unitsMeasures, isLoadingUnitsMeasures };
};

