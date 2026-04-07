import { unitsMeaureApi } from "@/services/api/unitsMeaure";
import {
  CreateUnitMeasurePayload,
  CreateUnitMeasureResponse,
} from "@/types/unitsMeasure";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toastConfig";
import { useRouter } from "next/navigation";
import { UnitMeasureFormData } from "@/schemas/unitMeasureSchema";

export const useCreateUnitsMeasure = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending } = useMutation<
    CreateUnitMeasureResponse,
    Error,
    CreateUnitMeasurePayload
  >({
    mutationFn: unitsMeaureApi.createUnitMeasure,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["unitsMeasures"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Unit measure created successfully",
      });
      router.push("/units");
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to create unit measure",
      });
    },
  });

  const onSubmit = (formData: UnitMeasureFormData) => {
    mutate({
      name: formData.name,
      abbreviation: formData.abbreviation,
    });
  };
  return { onSubmit, isPending };
};
