import { User } from '@/types/user.type';
import { apiClient } from './client';

export interface UpdateProfilePayload {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export const usersApi = {
  me: () => apiClient.get<User>('/users/me').then((r) => r.data as unknown as User),
  updateMe: (payload: UpdateProfilePayload) =>
    apiClient.patch<User>('/users/me', payload).then((r) => r.data as unknown as User),
  // Admin
  list: () => apiClient.get<User[]>('/users').then((r) => r.data as unknown as User[]),
  getById: (id: string) => apiClient.get<User>(`/users/${id}`).then((r) => r.data as unknown as User),
  update: (id: string, payload: UpdateProfilePayload & { role?: string }) =>
    apiClient.patch<User>(`/users/${id}`, payload).then((r) => r.data as unknown as User),
  remove: (id: string) => apiClient.delete(`/users/${id}`).then((r) => r.data),
};
