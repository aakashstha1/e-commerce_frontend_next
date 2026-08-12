import { Review, ReviewSummary } from "@/types/review.type";
import { apiClient } from "./client";

export interface ReviewPayload {
  productId: string;
  rating: number;
  comment?: string;
}

export const reviewsApi = {
  listForProduct: (productId: string) =>
    apiClient
      .get<Review[]>(`/reviews/product/${productId}`)
      .then((r) => r.data as unknown as Review[]),
  summaryForProduct: (productId: string) =>
    apiClient
      .get<ReviewSummary>(`/reviews/product/${productId}/summary`)
      .then((r) => r.data as unknown as ReviewSummary),
  create: (payload: ReviewPayload) =>
    apiClient
      .post<Review>("/reviews", payload)
      .then((r) => r.data as unknown as Review),
  update: (
    id: string,
    payload: Partial<Pick<ReviewPayload, "rating" | "comment">>,
  ) =>
    apiClient
      .patch<Review>(`/reviews/${id}`, payload)
      .then((r) => r.data as unknown as Review),
  remove: (id: string) =>
    apiClient.delete(`/reviews/${id}`).then((r) => r.data),
};
