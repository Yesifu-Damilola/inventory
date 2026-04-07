import { AxiosError } from "axios";
import { showToast } from "./toastConfig";
import { useAuthStore } from "@/zustand/useAuthStore";

interface ApiResponse {
  responseCode?: string;
  message?: string;
}

/**
 * Simple error handler to check for responseCode "11" and handle logout
 * @param error - The error object from axios or API response
 * @returns boolean - true if error was handled, false otherwise
 */
export const handleApiError = (error: AxiosError<ApiResponse>): boolean => {
  // Check if response has responseCode "11"
  const responseData = error?.response?.data as ApiResponse;

  if (responseData?.responseCode === "11") {
    // Handle session expired or invalid token
    const logout = useAuthStore.getState().logout;

    showToast({
      msg: responseData.message || "Something went wrong. Please try again.",
      type: "ERROR",
    });
    logout();
    return true;
  }
  return false;
};

/**
 * Generic error message handler - extracts message from various error formats
 * @param error - The error object
 * @returns string - The error message to display
 */
export const getErrorMessage = (error: any): string => {
  const responseData = error?.response?.data as
    | ApiResponse
    | AxiosError<ApiResponse>;

  return (
    responseData?.message ||
    error?.message ||
    "An unexpected error occurred. Please try again."
  );
};
