import { Category } from '@/types/category.type';
import { apiClient } from './client';

export interface CategoryPayload {
  name: string;
  slug?: string;
  parentId?: string;
}

export const categoriesApi = {
  list: () => apiClient.get<Category[]>('/categories').then((r) => r.data as unknown as Category[]),
  tree: () =>
    apiClient.get<Category[]>('/categories', { params: { tree: 'true' } }).then((r) => r.data as unknown as Category[]),
  getById: (id: string) => apiClient.get<Category>(`/categories/${id}`).then((r) => r.data as unknown as Category),
  create: (payload: CategoryPayload) =>
    apiClient.post<Category>('/categories', payload).then((r) => r.data as unknown as Category),
  update: (id: string, payload: Partial<CategoryPayload>) =>
    apiClient.patch<Category>(`/categories/${id}`, payload).then((r) => r.data as unknown as Category),
  remove: (id: string) => apiClient.delete(`/categories/${id}`).then((r) => r.data),
};
