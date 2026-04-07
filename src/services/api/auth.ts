// import { LoginFormData, SignUpFormData } from "@/schemas/settings/authSchema";
import {
  GetUserResponse,
  LoginResponse,
  LogoutResponse,
  SignUpResponse,
  UpdateProfileResponse,
  UpdateProfilePayload,
} from "@/types/user";
import { axiosInstance } from "../axios/axios";
import { LoginSchemaType, SignupSchemaType } from "@/schemas/authSchema";
import { axiosPrivate } from "../axios/axiosPrivate";

type SignUpPayload = Omit<SignupSchemaType, "confirmPassword"> & {
  password_confirmation: string;
};

const authApi = {
  // Sign in API
  signIn: async (payload: LoginSchemaType) => {
    const res = await axiosInstance.post<LoginResponse>("/auth/login", payload);
    return res?.data;
  },

  signUp: async (payload: SignUpPayload) => {
    // Sign up API
    const res = await axiosInstance.post<SignUpResponse>(
      "/auth/signup",
      payload,
    );
    return res?.data;
  },
  logout: async () => {
    const res = await axiosInstance.post<LogoutResponse>("/auth/logout");
    return res?.data;
  },

  getMe: async () => {
    const res = await axiosInstance.get<GetUserResponse>("/auth/me");
    return res?.data;
  },

  updateProfile: async (payload: UpdateProfilePayload) => {
    const res = await axiosPrivate.put<UpdateProfileResponse>(
      "/auth/profile",
      payload,
    );
    return res?.data;
  },
};

export default authApi;
