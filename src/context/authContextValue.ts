import { createContext } from "react";
import type { AuthUser, UserRole } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  signIn: (
    email: string,
    role: UserRole,
    password?: string,
  ) => boolean | Promise<boolean>;
  updateUser: (
    updates: Partial<
      Pick<AuthUser, "name" | "email" | "studentId" | "department">
    >,
  ) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
