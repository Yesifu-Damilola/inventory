"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  Suspense,
} from "react";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AuthRole, LoginUser } from "@/types/user";
import { AuthContextValue } from "@/types/authContextValue";
import authApi from "@/services/api/auth";
import { useAuthStore } from "@/zustand/useAuthStore";
import { sharedPersistConfig } from "@/lib/config/sharedConfig";
import { showToast } from "@/utils/toastConfig";
import { Toaster } from "react-hot-toast";

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<LoginUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, setIsPending] = useState(false);
  const storeUser = useAuthStore((state) => state.auth?.user ?? state.user);
  const storeLogout = useAuthStore((state) => state.logout);

  // Create QueryClient instance once using useState to avoid recreating on every render
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 minutes
            gcTime: 1000 * 60 * 5, // 5 minutes
            retry: 3, // 3 times
            retryDelay: 1000, // 1 seconds
          },
        },
      }),
  );

  // Keep provider user in sync with the persisted auth store.
  // This ensures components using `useAuth` reflect login state set by hooks using zustand.
  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Drop legacy localStorage auth from before session-scoped persistence (Zustand uses sessionStorage).
  useEffect(() => {
    try {
      localStorage.removeItem(sharedPersistConfig.PERSIST_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    if (storeUser) {
      setUser(storeUser);
      return;
    }
    setUser(null);
  }, [storeUser]);

  const login = useCallback(
    async (email: string, password: string, role: AuthRole = "user") => {
      setIsLoading(true);
      try {
        const data = await authApi.signIn({ email, password, role });
        if (data?.success) {
          setUser(data?.data?.user);
          sessionStorage.setItem("auth_token", data?.data?.token);
          sessionStorage.setItem("user", JSON.stringify(data?.data?.user));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      name: string,
      role: AuthRole = "user",
    ) => {
      setIsLoading(true);
      try {
        const data = await authApi.signUp({
          email,
          password,
          name,
          password_confirmation: password,
          role,
        });

        if (data?.success) {
          setUser(data?.data?.user);
          sessionStorage.setItem("auth_token", data?.data?.token);
          sessionStorage.setItem("user", JSON.stringify(data?.data?.user));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async () => {
    setIsPending(true);
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("user");
      showToast({ type: "SUCCESS", msg: "Logged out successfully" });
      setTimeout(() => {
        storeLogout();
      }, 400);
    }
  }, [storeLogout]);

  const isAdmin = user?.role?.toLowerCase() === "admin";

  return (
    <Suspense fallback={null}>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <AuthContext.Provider
            value={{
              user,
              isLoading,
              isPending,
              login,
              register,
              logout,
              isAdmin,
            }}
          >
            {children}
            <Toaster />
          </AuthContext.Provider>
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </NuqsAdapter>
    </Suspense>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
