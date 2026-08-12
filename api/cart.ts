import { Cart } from '@/types/cart.type';
import { apiClient } from './client';

export const cartApi = {
  get: () => apiClient.get<Cart>('/cart').then((r) => r.data as unknown as Cart),
  addItem: (productId: string, quantity: number) =>
    apiClient.post<Cart>('/cart/items', { productId, quantity }).then((r) => r.data as unknown as Cart),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.patch<Cart>(`/cart/items/${itemId}`, { quantity }).then((r) => r.data as unknown as Cart),
  removeItem: (itemId: string) =>
    apiClient.delete<Cart>(`/cart/items/${itemId}`).then((r) => r.data as unknown as Cart),
  clear: () => apiClient.delete('/cart').then((r) => r.data),
};
