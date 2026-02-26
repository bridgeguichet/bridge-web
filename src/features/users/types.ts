export type RoleEnum = "collecteur" | "transporteur" | "inspecteur" | "manager" | "admin";

export interface UserBasic {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
}

export interface UserOrganization {
  organization_id: string;
  organization_name: string;
  role: RoleEnum;
  role_display: string;
  joined_at: string;
}

export interface UserDetail {
  id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_staff: boolean;
  created_at: string;
  updated_at: string;
  organizations: UserOrganization[];
}

export interface CreateUserRequest {
  email: string;
  full_name: string;
  password: string;
  organization: string;
  role?: RoleEnum;
  is_active?: boolean;
}

export interface CreateUserResponse {
  id: string;
  email: string;
  full_name: string;
  organization: string;
  role?: RoleEnum;
  is_active?: boolean;
}

export interface UpdateUserRequest {
  email: string;
  full_name: string;
  is_active?: boolean;
  is_staff?: boolean;
}

export interface PaginatedUserList {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserDetail[];
}

export interface UserListParams {
  page?: number;
  search?: string;
  ordering?: string;
}
