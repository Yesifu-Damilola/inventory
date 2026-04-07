import { suppliersApi } from "@/services/api/suppliers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toastConfig";
import {
  CreateSupplierPayload,
  CreateSupplierResponse,
} from "@/types/suppliers";
import { SupplierFormData } from "@/schemas/supplierFormSchema";

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation<
    CreateSupplierResponse,
    Error,
    CreateSupplierPayload
  >({
    mutationFn: suppliersApi.createSupplier,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["suppliers"],
      });
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Supplier created successfully",
      });
    },
    onError: (error: any) => {
      showToast({
        type: "ERROR",
        msg: error?.response?.data?.message || "Failed to create supplier",
      });
    },
  });

  const onSubmit = (formData: SupplierFormData) => {
    mutate({
      name: formData.name,
      contact_person: formData.contact_person,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      is_active: formData.is_active,
    });
  };

  return { onSubmit, isPending };
};
