import { Product } from "./product.type";

export interface WishlistItem {
  _id: string;
  wishlistId: string;
  productId: Product | string;
}

export interface Wishlist {
  wishlist: { _id: string; userId: string };
  items: WishlistItem[];
}
