import { Product } from "./product.type";

export interface CartItem {
  _id: string;
  cartId: string;
  productId: Product | string;
  quantity: number;
  priceSnapshot: number;
}

export interface Cart {
  cart: { _id: string; userId: string };
  items: CartItem[];
  subTotal: number;
}
