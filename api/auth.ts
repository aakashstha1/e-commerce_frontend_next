import { AuthResponse } from '@/types/user.type';
import { apiClient } from './client';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}
export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  signup: (payload: RegisterPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', payload).then((r) => r.data as unknown as AuthResponse),
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload).then((r) => r.data as unknown as AuthResponse),
  logout: () => apiClient.post('/auth/logout').then((r) => r.data),
};
