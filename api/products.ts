import { Product } from '@/types/product.type';
import { apiClient } from './client';
import { PaginatedResult } from '@/types';

export interface ProductQuery {
  page?: number;
  limit?: number;
  sort?: 'asc' | 'desc';
  sortBy?: 'price' | 'createdAt' | 'name';
  search?: string;
  categoryId?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductPayload {
  categoryId: string;
  name: string;
  slug?: string;
  description: string;
  sku: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
}

export const productsApi = {
  list: (query: ProductQuery = {}) =>
    apiClient
      .get<PaginatedResult<Product>>('/products', { params: query })
      .then((r) => r.data as unknown as PaginatedResult<Product>),
  getById: (id: string) => apiClient.get<Product>(`/products/${id}`).then((r) => r.data as unknown as Product),
  getBySlug: (slug: string) =>
    apiClient.get<Product>(`/products/slug/${slug}`).then((r) => r.data as unknown as Product),

  // Admin — create() sends multipart/form-data since a thumbnail file can be attached.
  create: (payload: ProductPayload, thumbnail?: File) => {
    const form = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined) form.append(key, String(value));
    });
    if (thumbnail) form.append('thumbnail', thumbnail);
    return apiClient
      .post<Product>('/products', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data as unknown as Product);
  },
  update: (id: string, payload: Partial<ProductPayload>) =>
    apiClient.patch<Product>(`/products/${id}`, payload).then((r) => r.data as unknown as Product),
  updateThumbnail: (id: string, thumbnail: File) => {
    const form = new FormData();
    form.append('thumbnail', thumbnail);
    return apiClient
      .patch<Product>(`/products/${id}/thumbnail`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data as unknown as Product);
  },
  adjustStock: (id: string, quantity: number) =>
    apiClient.patch(`/products/${id}/stock`, { quantity }).then((r) => r.data),
  remove: (id: string) => apiClient.delete(`/products/${id}`).then((r) => r.data),
};
