import { useAuth } from "@/providers";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import authApi from "@/services/api/auth";
import { showToast } from "@/utils/toastConfig";
import { useAuthStore } from "@/zustand/useAuthStore";
import { LogoutResponse, UserLoggedInType } from "@/types/user";

export const useLogout = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isPending, mutate } = useMutation<LogoutResponse, Error, void>({
    mutationFn: authApi.logout,
    onSuccess: (data) => {
      if (data?.success) {
        showToast({ type: "SUCCESS", msg: "Logged out successfully" });
        router.replace("/login");
        setAuth({
          accessToken: "",
          user: undefined,
        } as UserLoggedInType);
      }
    },
    onError: (error) => {
      showToast({
        type: "ERROR",
        msg: "Failed to logout",
      });
      console.log(error);
    },
  });
  return { isPending, mutate };
};
