import { Wishlist } from "@/types/wishlist.type";
import { apiClient } from "./client";

export const wishlistApi = {
  get: () =>
    apiClient
      .get<Wishlist>("/wishlist")
      .then((r) => r.data as unknown as Wishlist),
  addItem: (productId: string) =>
    apiClient
      .post<Wishlist>("/wishlist/items", { productId })
      .then((r) => r.data as unknown as Wishlist),
  removeItem: (productId: string) =>
    apiClient
      .delete<Wishlist>(`/wishlist/items/${productId}`)
      .then((r) => r.data as unknown as Wishlist),
};
