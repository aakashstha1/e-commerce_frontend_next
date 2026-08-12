'use client';
import { cartApi } from '@/api/cart';
import { getApiErrorMessage } from '@/api/client';
import { useAuthStore } from '@/store/auth-store';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';


export function useCart() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartApi.get,
    enabled: !!accessToken,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      cartApi.addItem(productId, quantity),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      toast.success('Added to cart');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: (data) => queryClient.setQueryData(['cart'], data),
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], data);
      toast.success('Item removed');
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useClearCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
}
