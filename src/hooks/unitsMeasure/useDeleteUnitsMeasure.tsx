import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { DeleteUnitMeasureResponse } from "@/types/unitsMeasure";
import { showToast } from "@/utils/toastConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type UseDeleteUnitsMeasureOptions = {
  onSuccess?: (data: DeleteUnitMeasureResponse) => void;
};

export const useDeleteUnitsMeasure = (
  options?: UseDeleteUnitsMeasureOptions,
) => {
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
      queryClient.invalidateQueries({
        queryKey: ["unitsMeasure"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Unit measure deleted successfully",
      });
      options?.onSuccess?.(data);
    },
    onError: (error: unknown) => {
      const err = error as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      showToast({
        type: "ERROR",
        msg:
          err?.response?.data?.message ||
          err?.message ||
          "Failed to delete unit measure",
      });
    },
  });

  const onSubmit = (unit_of_measure: string) => {
    mutate(unit_of_measure);
  };

  return { onSubmit, isPending };
};
