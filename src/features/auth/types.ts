export interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  image?: string;
  role: string; // customer, vendor, admin
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  user: User;
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  success: boolean;
  user: User;
}

export interface LogoutResponse {
  success: boolean;
}

export interface ProfileResponse {
  user: User;
}

export interface AuthError {
  error: string;
  message?: string;
}
