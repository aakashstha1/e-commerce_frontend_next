"use client";
import { getApiErrorMessage } from "@/api/client";
import { type ReviewPayload, reviewsApi } from "@/api/reviews";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useProductReviews(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewsApi.listForProduct(productId),
    enabled: !!productId,
  });
}

export function useReviewSummary(productId: string) {
  return useQuery({
    queryKey: ["reviews", productId, "summary"],
    queryFn: () => reviewsApi.summaryForProduct(productId),
    enabled: !!productId,
  });
}

export function useCreateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ReviewPayload) => reviewsApi.create(payload),
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({
        queryKey: ["reviews", payload.productId],
      });
      toast.success("Review submitted");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
