import { useMemo, useState, type ReactNode } from "react";
import { mockAuthProfiles } from "../data/mockData";
import { isApiEnabled } from "../services/api";
import { loginRequest } from "../services/authService";
import type { AuthUser, UserRole } from "../types";
import { AuthContext } from "./authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem("borrowdesk-user");
    if (!savedUser) return null;
    const saved = JSON.parse(savedUser) as AuthUser;
    const profile =
      mockAuthProfiles.find(
        (candidate) =>
          candidate.email.toLowerCase() === saved.email.toLowerCase(),
      ) ?? mockAuthProfiles.find((candidate) => candidate.role === saved.role);
    return profile
      ? { ...profile, email: saved.email || profile.email }
      : saved;
  });

  const signIn = async (email: string, role: UserRole, password?: string) => {
    if (isApiEnabled()) {
      try {
        const result = await loginRequest(email, password ?? "");
        setUser(result.user);
        localStorage.setItem("borrowdesk-token", result.token);
        localStorage.setItem("borrowdesk-user", JSON.stringify(result.user));
        return true;
      } catch {
        return false;
      }
    }
    const profile =
      mockAuthProfiles.find(
        (candidate) =>
          candidate.email.toLowerCase() === email.trim().toLowerCase(),
      ) ??
      mockAuthProfiles.find((candidate) => candidate.role === role) ??
      mockAuthProfiles[0];
    if (profile.password && profile.password !== password) return false;
    const resolvedRole =
      profile.email.toLowerCase() === email.trim().toLowerCase()
        ? profile.role
        : role;
    const nextUser: AuthUser = {
      ...profile,
      email: email || profile.email,
      role: resolvedRole,
    };
    setUser(nextUser);
    localStorage.setItem("borrowdesk-user", JSON.stringify(nextUser));
    return true;
  };

  const updateUser = (
    updates: Partial<
      Pick<AuthUser, "name" | "email" | "studentId" | "department">
    >,
  ) => {
    setUser((currentUser) => {
      if (!currentUser) return currentUser;
      const nextUser = { ...currentUser, ...updates };
      localStorage.setItem("borrowdesk-user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("borrowdesk-user");
    localStorage.removeItem("borrowdesk-token");
  };
  const value = useMemo(() => ({ user, signIn, updateUser, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
