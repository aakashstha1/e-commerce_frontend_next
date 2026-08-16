"use client";
import { getApiErrorMessage } from "@/api/client";
import { OrderQuery, ordersApi } from "@/api/orders";
import { type OrderStatus } from "@/types/order.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useMyOrders(query: OrderQuery = {}) {
  return useQuery({
    queryKey: ["orders", "mine", query],
    queryFn: () => ordersApi.myOrders(query),
  });
}

export function useAllOrders(query: OrderQuery = {}) {
  return useQuery({
    queryKey: ["orders", "all", query],
    queryFn: () => ordersApi.allOrders(query),
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getById(id),
    enabled: !!id,
  });
}

/** COD checkout only — places the order immediately. */
export function useCheckoutCod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      addressId,
      couponCode,
    }: {
      addressId: string;
      couponCode?: string;
    }) => ordersApi.checkoutCod(addressId, couponCode),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully!");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.cancel(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Order cancelled");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) =>
      ordersApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Order status updated");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
