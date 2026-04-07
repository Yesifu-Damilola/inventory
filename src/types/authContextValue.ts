import { AuthRole, LoginUser } from "./user";

export interface AuthContextValue {
  user: LoginUser | null;
  isLoading: boolean;
  isPending: boolean;
  login: (email: string, password: string, role?: AuthRole) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    role?: AuthRole,
  ) => Promise<void>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}
