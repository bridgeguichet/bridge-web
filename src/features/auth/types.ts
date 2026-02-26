export interface User {
  id: string;
  email: string;
  full_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  avatar?: string;
  organization?: {
    id: string;
    name: string;
    role: "admin" | "manager" | "inspecteur" | "transporteur" | "collecteur";
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
}

export interface RefreshResponse {
  success: boolean;
}

export interface ProfileResponse {
  user: User;
}

export interface AuthError {
  error: string;
  message?: string;
}
