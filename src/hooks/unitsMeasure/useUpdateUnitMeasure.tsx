import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  UpdateUnitMeasureResponse,
  UpdateUnitMeasurePayload,
} from "@/types/unitsMeasure";
import { showToast } from "@/utils/toastConfig";

export const useUpdateUnitMeasure = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    UpdateUnitMeasureResponse,
    Error,
    UpdateUnitMeasurePayload
  >({
    mutationFn: (payload: UpdateUnitMeasurePayload) =>
      unitsMeaureApi.updateUnitMeasure(payload.id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["unitsMeasures"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Unit measure updated successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to update unit measure",
      });
    },
  });

  const onSubmit = (payload: UpdateUnitMeasurePayload) => {
    mutate(payload);
  };

  return { onSubmit, isPending };
};
