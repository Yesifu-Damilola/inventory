import { suppliersApi } from "@/services/api/suppliers";
import {
  UpdateSupplierPayload,
  UpdateSupplierResponse,
} from "@/types/suppliers";
import { showToast } from "@/utils/toastConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateSupplier = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    UpdateSupplierResponse,
    Error,
    UpdateSupplierPayload
  >({
    mutationFn: (payload: UpdateSupplierPayload) =>
      suppliersApi.updateSupplier(payload.id, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Supplier updated successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to update supplier",
      });
    },
  });

  const onSubmit = (payload: UpdateSupplierPayload) => {
    mutate(payload);
  };

  return { onSubmit, isPending };
};
