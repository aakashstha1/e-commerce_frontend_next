import { Notification } from '@/types/notification.type';
import { apiClient } from './client';

export const notificationsApi = {
  list: () => apiClient.get<Notification[]>('/notifications').then((r) => r.data as unknown as Notification[]),
  markAsRead: (id: string) => apiClient.patch(`/notifications/${id}/read`).then((r) => r.data),
  markAllAsRead: () => apiClient.patch('/notifications/read-all').then((r) => r.data),
};
