import { Payment, PaymentMethod } from "@/types/payment.type";
import { apiClient } from "./client";

export interface EsewaFormPayload {
  action: string;
  fields: Record<string, string>;
}

export const paymentsApi = {
  // COD only.
  initiate: (orderId: string, method: PaymentMethod) =>
    apiClient
      .post<Payment>("/payments", { orderId, method })
      .then((r) => r.data as unknown as Payment),
  // Returns signed form fields to auto-submit straight to eSewa's payment page.
  // No order exists yet — it's created only once eSewa confirms payment.
  initiateEsewa: (addressId: string) =>
    apiClient
      .post<EsewaFormPayload>("/payments/esewa/initiate", { addressId })
      .then((r) => r.data as unknown as EsewaFormPayload),
  getByOrder: (orderId: string) =>
    apiClient
      .get<Payment>(`/payments/order/${orderId}`)
      .then((r) => r.data as unknown as Payment),
  // Admin
  markCodPaid: (paymentId: string) =>
    apiClient.patch(`/payments/${paymentId}/mark-cod-paid`).then((r) => r.data),
  markCodPaidByOrder: (orderId: string) =>
    apiClient
      .patch(`/payments/order/${orderId}/mark-cod-paid`)
      .then((r) => r.data),
  markFailed: (paymentId: string) =>
    apiClient.patch(`/payments/${paymentId}/fail`).then((r) => r.data),
};
