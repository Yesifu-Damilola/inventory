import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { DeleteUnitMeasureResponse } from "@/types/unitsMeasure";
import { showToast } from "@/utils/toastConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteUnitsMeasure = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    DeleteUnitMeasureResponse,
    Error,
    string
  >({
    mutationFn: (unit_of_measure: string) =>
      unitsMeaureApi.deleteUnitMeasure(unit_of_measure),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["unitsMeasures"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Unit measure deleted successfully",
      });
    },
  });

  const onSubmit = (unit_of_measure: string) => {
    mutate(unit_of_measure);
  };

  return { onSubmit, isPending };
};
