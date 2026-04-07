import { suppliersApi } from "@/services/api/suppliers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toastConfig";
import { DeleteSupplierResponse } from "@/types/suppliers";

export const useDeleteSupplier = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    DeleteSupplierResponse,
    Error,
    string
  >({
    mutationFn: (supplierId: string) => suppliersApi.deleteSupplier(supplierId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Supplier deleted successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.message || "Failed to delete supplier",
      });
    },
  });

  const onSubmit = (supplierId: string) => {
    mutate(supplierId);
  };

  return { onSubmit, isPending };
};
