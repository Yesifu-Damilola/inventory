import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { useQuery } from "@tanstack/react-query";

export const useGetUnitsMeasureById = (unitsMeasureId: string) => {
  const {
    data: unitsMeasure,
    isPending,
    error,
  } = useQuery({
    queryKey: ["unitsMeasure", unitsMeasureId],
    queryFn: () => unitsMeaureApi.getUnitMeasureById(unitsMeasureId),
    enabled: !!unitsMeasureId,
  });

  return { unitsMeasure, isPending, error };
};
