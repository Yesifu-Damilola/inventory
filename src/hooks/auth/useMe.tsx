"use client";
import authApi from "@/services/api/auth";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/zustand/useAuthStore";

export const useMe = () => {
  // Use Zustand token to decide if we can fetch.
  // This avoids relying on a different/legacy localStorage key.
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ["user-me"],
    queryFn: () => authApi.getMe(),
    retry: false,
    enabled: !!accessToken,
  });
};
