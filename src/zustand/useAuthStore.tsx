"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { produce } from "immer";
import { sharedPersistConfig } from "@/lib/config/sharedConfig";
import { LoginUser, UserLoggedInType } from "@/types/user";

// Define the shape of your app state
interface AuthState {
  accessToken: string | null;
  setToken: (token: string) => void;
  user: LoginUser | null;
  auth: UserLoggedInType | null;
  logout: () => void;
  setAuth: (auth: UserLoggedInType) => void;
  updateAuth: (auth: UserLoggedInType) => void;
  isLoggingOut: boolean;
  isAuthenticated: boolean;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
}

// Create the zustand store with middleware for persistence and immer
export const useAuthStore = create<AuthState>()(
  persist<AuthState>(
    (set) => ({
      accessToken: null,
      setToken: (token: string) => set({ accessToken: token }),
      user: null,
      auth: null, // Initialize the user state as null
      isAuthenticated: false,
      isLoggingOut: false,
      setIsAuthenticated: (isAuthenticated: boolean) =>
        set(
          produce((state: AuthState) => {
            state.isAuthenticated = isAuthenticated;
          }),
        ),
      setAuth: (auth: UserLoggedInType) =>
        set(
          produce((state: AuthState) => {
            state.auth = auth;
            state.accessToken = auth?.accessToken; // ✅ ADD THIS LINE
            state.isAuthenticated = !!auth?.accessToken;
          }),
        ),
      updateAuth: (auth: UserLoggedInType) =>
        set(
          produce((state: AuthState) => {
            if (state.auth) {
              Object.assign(state.auth, {
                accessToken: auth?.accessToken,
              } as UserLoggedInType); // Update the user state partially
            }
          }),
        ),
      logout: () => {
        set({ isLoggingOut: true });
        set(
          produce((state: AuthState) => {
            state.auth = null; // Clear the auth state
            state.isAuthenticated = false; // Set isAuthenticated to false
          }),
        );
        sessionStorage.removeItem(sharedPersistConfig.PERSIST_KEY);
        try {
          localStorage.removeItem(sharedPersistConfig.PERSIST_KEY);
        } catch {
          /* ignore */
        }
        set({ isLoggingOut: false });
        return window.location.replace("/login");
      },
    }),
    {
      name: sharedPersistConfig.PERSIST_KEY,
      // Tab-scoped: closing the browser tab/window clears the session (login required again).
      storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          } as unknown as Storage;
        }
        return window.sessionStorage;
      }),
    },
  ),
);
