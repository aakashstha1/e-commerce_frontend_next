// Shared types mirroring the NestJS backend's schemas/DTOs exactly.

// export enum UserRole {
//   USER = 'user',
//   ADMIN = 'admin',
// }

// export enum OrderStatus {
//   PENDING = 'pending',
//   PROCESSING = 'processing',
//   SHIPPED = 'shipped',
//   DELIVERED = 'delivered',
//   CANCELLED = 'cancelled',
// }

// export enum PaymentStatus {
//   PENDING = 'pending',
//   PAID = 'paid',
//   FAILED = 'failed',
//   REFUNDED = 'refunded',
// }

// export enum PaymentMethod {
//   COD = 'cod',
//   STRIPE = 'stripe',
//   ESEWA = 'esewa',
//   KHALTI = 'khalti',
// }

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   phone?: string;
//   role: UserRole;
//   avatarUrl?: string;
//   isVerified: boolean;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface Address {
//   _id: string;
//   userId: string;
//   fullName: string;
//   country: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   street: string;
//   isDefault: boolean;
//   createdAt: string;
// }

// export interface Category {
//   _id: string;
//   name: string;
//   slug: string;
//   parentId?: string | null;
//   children?: Category[];
// }

// export interface ProductImage {
//   _id: string;
//   productId: string;
//   imageUrl: string;
//   sortOrder: number;
// }

// export interface Product {
//   _id: string;
//   categoryId: string;
//   name: string;
//   slug: string;
//   description: string;
//   sku: string;
//   brand?: string;
//   price: number;
//   discountPrice?: number | null;
//   stockQuantity: number;
//   thumbnailUrl?: string;
//   isActive: boolean;
//   images?: ProductImage[];
//   createdAt: string;
//   updatedAt: string;
// }

export interface PaginatedResult<T> {
  items: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}

// export interface CartItem {
//   _id: string;
//   cartId: string;
//   productId: Product | string;
//   quantity: number;
//   priceSnapshot: number;
// }

// export interface Cart {
//   cart: { _id: string; userId: string };
//   items: CartItem[];
//   subTotal: number;
// }

// export interface WishlistItem {
//   _id: string;
//   wishlistId: string;
//   productId: Product | string;
// }

// export interface Wishlist {
//   wishlist: { _id: string; userId: string };
//   items: WishlistItem[];
// }

// export interface OrderItem {
//   _id: string;
//   orderId: string;
//   productId: Product | string;
//   quantity: number;
//   unitPrice: number;
//   discount: number;
//   totalPrice: number;
// }

// export interface Order {
//   _id: string;
//   userId: string | User;
//   addressId: string | Address;
//   orderNumber: string;
//   subTotal: number;
//   discount: number;
//   shippingFee: number;
//   tax: number;
//   total: number;
//   status: OrderStatus;
//   paymentStatus: PaymentStatus;
//   placedAt: string;
//   updatedAt: string;
// }

// export interface OrderWithItems {
//   order: Order;
//   items: OrderItem[];
// }

// export interface Payment {
//   _id: string;
//   orderId: string;
//   method: PaymentMethod;
//   transactionId?: string | null;
//   amount: number;
//   currency: string;
//   status: string;
//   paidAt?: string | null;
//   createdAt: string;
// }

// export interface Review {
//   _id: string;
//   userId: string | User;
//   productId: string;
//   rating: number;
//   comment?: string;
//   createdAt: string;
//   updatedAt: string;
// }

// export interface ReviewSummary {
//   average: number;
//   totalCount: number;
//   distribution: Record<number, number>;
// }

// export interface Notification {
//   _id: string;
//   userId: string;
//   type: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
// }

// export interface AuthTokens {
//   accessToken: string;
//   refreshToken: string;
// }

// export interface AuthResponse extends AuthTokens {
//   user: User;
// }

// Envelope shape produced by the backend's global TransformInterceptor
export interface ApiEnvelope<T> {
  success: boolean;
  statusCode: number;
  data: T;
  timestamp: string;
}
