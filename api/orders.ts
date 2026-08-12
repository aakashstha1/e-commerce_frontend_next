import { Order, OrderStatus, OrderWithItems } from '@/types/order.type';
import { apiClient } from './client';
import { PaginatedResult } from '@/types';

export interface OrderQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
}

export const ordersApi = {
  checkout: (addressId: string, couponCode?: string) =>
    apiClient
      .post<OrderWithItems>('/orders', { addressId, couponCode })
      .then((r) => r.data as unknown as OrderWithItems),
  myOrders: (query: OrderQuery = {}) =>
    apiClient
      .get<PaginatedResult<Order>>('/orders', { params: query })
      .then((r) => r.data as unknown as PaginatedResult<Order>),
  allOrders: (query: OrderQuery = {}) =>
    apiClient
      .get<PaginatedResult<Order>>('/orders/admin/all', { params: query })
      .then((r) => r.data as unknown as PaginatedResult<Order>),
  getById: (id: string) =>
    apiClient.get<OrderWithItems>(`/orders/${id}`).then((r) => r.data as unknown as OrderWithItems),
  cancel: (id: string) =>
    apiClient.patch<Order>(`/orders/${id}/cancel`).then((r) => r.data as unknown as Order),
  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data as unknown as Order),
};
