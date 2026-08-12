import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/order.type";
import { PaymentStatus } from "@/types/payment.type";

const orderStatusVariant: Record<
  OrderStatus,
  "default" | "secondary" | "destructive" | "success" | "warning"
> = {
  [OrderStatus.PENDING]: "warning",
  [OrderStatus.PROCESSING]: "secondary",
  [OrderStatus.SHIPPED]: "default",
  [OrderStatus.DELIVERED]: "success",
  [OrderStatus.CANCELLED]: "destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={orderStatusVariant[status]}>{status}</Badge>;
}

const paymentStatusVariant: Record<
  PaymentStatus,
  "default" | "secondary" | "destructive" | "success" | "warning"
> = {
  [PaymentStatus.PENDING]: "warning",
  [PaymentStatus.PAID]: "success",
  [PaymentStatus.FAILED]: "destructive",
  [PaymentStatus.REFUNDED]: "secondary",
};

export function PaymentStatusBadge({ status }: { status: PaymentStatus }) {
  return <Badge variant={paymentStatusVariant[status]}>{status}</Badge>;
}
