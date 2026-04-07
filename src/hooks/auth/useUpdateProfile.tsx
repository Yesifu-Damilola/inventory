import authApi from "@/services/api/auth";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { showToast } from "@/utils/toastConfig";
import { UpdateProfilePayload, UpdateProfileResponse, UserLoggedInType } from "@/types/user";
import { ProfileSchemaType } from "@/schemas/profileSchema";
import { useAuthStore } from "@/zustand/useAuthStore";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const auth = useAuthStore((state) => state.auth);

  const { mutate, isPending } = useMutation<
    UpdateProfileResponse,
    Error,
    UpdateProfilePayload
  >({
    mutationFn: authApi.updateProfile,

    onSuccess: (data) => {
      if (data?.success) {
        // ✅ Update React Query cache
        queryClient.setQueryData(["user-me"], (oldData: any) => ({
          ...oldData,
          data: {
            ...oldData?.data,
            ...data?.data,
          },
        }));

        // ✅ Optional: update Zustand user
        const currentAuth = useAuthStore.getState().auth;

        if (!currentAuth) return;
        useAuthStore.getState().setAuth({
          ...currentAuth,
          user: currentAuth.user
            ? {
                ...currentAuth.user, // ✅ keep existing fields
                ...data?.data, // ✅ override only what backend returned
              }
            : undefined,
          accessToken: currentAuth.accessToken, // ✅ keep token intact
        } as UserLoggedInType);

        showToast({
          type: "SUCCESS",
          msg: "Profile updated successfully",
        });
      }
    },

    onError: (error) => {
      showToast({
        type: "ERROR",
        msg: "Failed to update profile",
      });
      console.log(error);
    },
  });

  const onSubmit = (values: ProfileSchemaType) => {
    if (!auth?.user?.id) {
      showToast({
        type: "ERROR",
        msg: "User not found. Please login again.",
      });
      return;
    }

    const payload: UpdateProfilePayload = {
      name: values?.name,
      email: values?.email,
    };

    mutate(payload);
  };

  return { onSubmit, isPending };
};
