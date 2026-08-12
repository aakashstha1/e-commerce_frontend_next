"use client";
import { getApiErrorMessage } from "@/api/client";
import { wishlistApi } from "@/api/wishlist";
import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useWishlist() {
  const accessToken = useAuthStore((s) => s.accessToken);
  return useQuery({
    queryKey: ["wishlist"],
    queryFn: wishlistApi.get,
    enabled: !!accessToken,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.addItem(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], data);
      toast.success("Added to wishlist");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (productId: string) => wishlistApi.removeItem(productId),
    onSuccess: (data) => {
      queryClient.setQueryData(["wishlist"], data);
      toast.success("Removed from wishlist");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
