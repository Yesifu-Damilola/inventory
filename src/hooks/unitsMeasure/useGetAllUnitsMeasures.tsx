import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { useQuery } from "@tanstack/react-query";

export const useGetAllUnitsMeasures = () => {
  const { data: unitsMeasures = [], isPending: isLoadingUnitsMeasures } = useQuery({
    queryKey: ["unitsMeasures"],
    queryFn: unitsMeaureApi.getAllUnitsMeasures,
    select: (data) => data.data,
  });

  return { unitsMeasures, isLoadingUnitsMeasures };
};
