import { showToast } from "@/utils/toastConfig";
import { useAuthStore } from "@/zustand/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import authApi from "@/services/api/auth";
import { useRouter } from "next/navigation";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchema";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { isPending, mutate } = useMutation({
    mutationFn: authApi.signIn,
    onSuccess: (data) => {
        if (data?.success) {
          setAuth({
            accessToken: data?.data?.token,
            user: data?.data?.user,
          });

          queryClient.setQueryData(["user-me"], {
            message: data?.message,
            data: data?.data?.user,
          });

          const successMsg =
            data?.message?.trim() || "Logged in successfully";
          showToast({
            type: "SUCCESS",
            msg: successMsg,
          });
          router.replace("/dashboard");
          return;
        }

        showToast({
          type: "ERROR",
          msg: data?.message || "Login failed. Please try again.",
        });
      },
    onError: (error: any) => {
      const responseCode = error?.response?.data?.responseCode;
      const statusCode = error?.response?.data?.statusCode;
      const httpStatus = error?.response?.status;

      if (responseCode === "11" || statusCode === 401 || httpStatus === 401) {
        showToast({
          type: "ERROR",
          msg:
            error?.response?.data?.message || "Login failed. Please try again.",
        });
        return;
      }
      showToast({
        type: "ERROR",
        msg:
          error?.response?.data?.message || "Login failed. Please try again.",
      });
    },
  });

  const { control, handleSubmit } = useForm<LoginSchemaType>({
    defaultValues: {
      email: "",
      password: "",
      role: "user" as "admin" | "user",
    },
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = (data: LoginSchemaType) => {
    mutate(data);
  };
  return {
    control,
    handleSubmit,
    onSubmit,
    isPending,
  };
};
