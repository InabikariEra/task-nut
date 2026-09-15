export type UserRole = "ADMIN" | "STAFF" | "USER";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  studentId?: string;
  department?: string;
  password?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}
