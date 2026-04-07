import { useAuthStore } from "@/zustand/useAuthStore";
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL as string,
  headers: { "Content-Type": "application/json" },
  timeout: 60000,
});

axiosInstance.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
