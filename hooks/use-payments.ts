"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentsApi } from "@/api/payments";
import { getApiErrorMessage } from "@/api/client";

export function usePaymentByOrder(orderId: string) {
  return useQuery({
    queryKey: ["payment", "order", orderId],
    queryFn: () => paymentsApi.getByOrder(orderId),
    enabled: !!orderId,
  });
}

/** Admin-only: marks a Cash on Delivery payment as collected. */
export function useMarkCodPaid() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId: string) => paymentsApi.markCodPaidByOrder(orderId),
    onSuccess: (_, orderId) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["payment", "order", orderId] });
      toast.success("Payment marked as paid");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
