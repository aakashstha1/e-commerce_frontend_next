export interface Payment {
  _id: string;
  orderId: string;
  method: PaymentMethod;
  transactionId?: string | null;
  amount: number;
  currency: string;
  status: string;
  paidAt?: string | null;
  createdAt: string;
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum PaymentMethod {
  COD = "cod",
  STRIPE = "stripe",
  ESEWA = "esewa",
  KHALTI = "khalti",
}
