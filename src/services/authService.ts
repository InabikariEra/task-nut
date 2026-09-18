import type { AuthUser } from "../types";
import { api } from "./api";

export async function loginRequest(email: string, password: string) {
  const response = await api.post<{ token: string; user: AuthUser }>(
    "/auth/login",
    { email, password },
  );
  return response.data;
}
