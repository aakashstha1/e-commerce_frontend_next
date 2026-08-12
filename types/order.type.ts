import { Address } from "./address.type";
import { PaymentStatus } from "./payment.type";
import { Product } from "./product.type";
import { User } from "./user.type";

export interface OrderItem {
  _id: string;
  orderId: string;
  productId: Product | string;
  quantity: number;
  unitPrice: number;
  discount: number;
  totalPrice: number;
}

export interface Order {
  _id: string;
  userId: string | User;
  addressId: string | Address;
  orderNumber: string;
  subTotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  placedAt: string;
  updatedAt: string;
}

export interface OrderWithItems {
  order: Order;
  items: OrderItem[];
}

export enum OrderStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}
