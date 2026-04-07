"use client";
import { useRouter } from "next/navigation";

export const useRedirect = () => {
  const navigate = useRouter();

  const redirectToPage = (path?: string) => {
    if (!path) {
      return navigate?.back();
    }
    navigate.push(path);
  };
  return redirectToPage;
};
