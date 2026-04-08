import { SignupSchemaType, SignupSchema } from "@/schemas/authSchema";
import { showToast } from "@/utils/toastConfig";
import { SignUpResponse } from "@/types/user";
import { useAuthStore } from "@/zustand/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import authApi from "@/services/api/auth";

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role: "admin" | "user";
};

export const useSignUp = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((state) => state.setAuth);

  const { isPending, mutate } = useMutation<
    SignUpResponse,
    Error,
    SignUpPayload
  >({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      if (data?.success) {
        setAuth({
          accessToken: data.data.token,
          user: data.data.user,
        });
        queryClient.setQueryData(["user-me"], {
          message: data.message,
          data: data.data.user,
        });
        showToast({
          type: "SUCCESS",
          msg: data.message?.trim() || "Account created successfully!",
        });
        router.replace("/dashboard");
        return;
      }

      showToast({
        type: "ERROR",
        msg: data?.message || "Signup failed. Please try again.",
      });
    },

    onError: (error) => {
      const errorMessage =
        (error as any)?.response?.data?.message ||
        error.message ||
        "Signup failed. Please try again.";

      showToast({
        type: "ERROR",
        msg: errorMessage,
      });
    },
  });

  const { control, handleSubmit, formState } = useForm<SignupSchemaType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user" as "admin" | "user",
    },
    resolver: zodResolver(SignupSchema),
  });

  // ✅ Form submission
  const onSubmit = (formData: SignupSchemaType) => {
    const payload: SignUpPayload = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      role: formData.role,
    };
    mutate(payload);
  };

  return {
    control,
    handleSubmit,
    onSubmit,
    isPending,
    errors: formState.errors,
  };
};
