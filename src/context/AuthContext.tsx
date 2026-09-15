import { useMemo, useState, type ReactNode } from "react";
import type { AuthUser, UserRole } from "../types";
import { AuthContext } from "./authContextValue";
import { mockAuthProfiles } from "../data/mockData";

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

  const signIn = (email: string, role: UserRole, password?: string) => {
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
  };
  const value = useMemo(() => ({ user, signIn, updateUser, signOut }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
