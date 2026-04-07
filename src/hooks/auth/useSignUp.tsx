import { SignupSchemaType, SignupSchema } from "@/schemas/authSchema";
import { showToast } from "@/utils/toastConfig";
import { SignUpResponse } from "@/types/user";
import { useAuthStore } from "@/zustand/useAuthStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
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
  const { setAuth } = useAuthStore();

  // ✅ Setup mutation for signup API
  const { isPending, mutate } = useMutation<
    SignUpResponse,
    Error,
    SignUpPayload
  >({
    mutationFn: authApi.signUp,
    onSuccess: (data) => {
      showToast({
        type: "SUCCESS",
        msg: data?.message || "Account created successfully!",
      });
      console.log(mutate);
      setAuth({
        accessToken: data?.data?.token,
      }); // Save user data to Zustand store
      return router.push("/");
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

  // ✅ React Hook Form configuration
  const { control, handleSubmit } = useForm<SignupSchemaType>({
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
  };
};
