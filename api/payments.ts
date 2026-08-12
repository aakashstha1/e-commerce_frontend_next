import { Payment, PaymentMethod } from '@/types/payment.type';
import { apiClient } from './client';

export interface InitiatePaymentResult {
  payment: Payment;
  deeplink?: string;
  redirectUrl?: string;
}

export const paymentsApi = {
  initiate: (orderId: string, method: PaymentMethod) =>
    apiClient
      .post<InitiatePaymentResult>('/payments', { orderId, method })
      .then((r) => r.data as unknown as InitiatePaymentResult),
  getByOrder: (orderId: string) =>
    apiClient.get<Payment>(`/payments/order/${orderId}`).then((r) => r.data as unknown as Payment),
  checkEsewaStatus: (paymentId: string) =>
    apiClient.get(`/payments/${paymentId}/esewa/status`).then((r) => r.data),
  // Admin
  markCodPaid: (paymentId: string) =>
    apiClient.patch(`/payments/${paymentId}/mark-cod-paid`).then((r) => r.data),
  markFailed: (paymentId: string) =>
    apiClient.patch(`/payments/${paymentId}/fail`).then((r) => r.data),
};
