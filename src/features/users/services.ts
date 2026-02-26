import { axiosInstance } from "@/lib/axios/axios-instance";

import type {
  CreateUserRequest,
  CreateUserResponse,
  PaginatedUserList,
  UpdateUserRequest,
  UserDetail,
  UserListParams,
} from "./types";

const USERS_BASE_URL = "/api/auth/admin/users";

export const usersService = {
  getUsers: async (params?: UserListParams): Promise<PaginatedUserList> => {
    const { data } = await axiosInstance.get<PaginatedUserList>(`${USERS_BASE_URL}/`, { params });
    return data;
  },

  getUserById: async (id: string): Promise<UserDetail> => {
    const { data } = await axiosInstance.get<UserDetail>(`${USERS_BASE_URL}/${id}/`);
    return data;
  },

  createUser: async (userData: CreateUserRequest): Promise<CreateUserResponse> => {
    const { data } = await axiosInstance.post<CreateUserResponse>(`${USERS_BASE_URL}/`, userData);
    return data;
  },

  updateUser: async (id: string, userData: UpdateUserRequest): Promise<UserDetail> => {
    const { data } = await axiosInstance.put<UserDetail>(`${USERS_BASE_URL}/${id}/`, userData);
    return data;
  },

  partialUpdateUser: async (id: string, userData: Partial<UpdateUserRequest>): Promise<UserDetail> => {
    const { data } = await axiosInstance.patch<UserDetail>(`${USERS_BASE_URL}/${id}/`, userData);
    return data;
  },

  deleteUser: async (id: string): Promise<void> => {
    await axiosInstance.delete(`${USERS_BASE_URL}/${id}/`);
  },

  activateUser: async (id: string): Promise<void> => {
    await axiosInstance.post(`${USERS_BASE_URL}/${id}/activate/`);
  },

  deactivateUser: async (id: string): Promise<void> => {
    await axiosInstance.post(`${USERS_BASE_URL}/${id}/deactivate/`);
  },
};
