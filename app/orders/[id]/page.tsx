"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/common/order-status-badge";
import { useOrder, useCancelOrder } from "@/hooks/use-orders";
import { OrderStatus } from "@/types/order.type";
import { formatDate } from "@/utils/date-format";
import { formatCurrency } from "@/utils/currency-format";
import type { Product } from "@/types/product.type";
import type { Address } from "@/types/address.type";

function OrderDetailContent() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useOrder(params.id);
  const cancelOrder = useCancelOrder();

  if (isLoading || !data) {
    return (
      <div className="container py-8 space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }
  const { order, items } = data;
  const address =
    typeof order.addressId === "string" ? null : (order.addressId as Address);
  const canCancel = [OrderStatus.PENDING, OrderStatus.PROCESSING].includes(
    order.status,
  );

  return (
    <div className="container py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {formatDate(order.placedAt)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.paymentStatus} />
          <span className="text-xs uppercase text-muted-foreground">
            {order.paymentMethod}
          </span>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {items.map((item) => {
                const product =
                  typeof item.productId === "string"
                    ? null
                    : (item.productId as Product);
                return (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span>
                      {product?.name ?? "Product"}
                      <span className="font-bold">
                        {" "}
                        &times; {item.quantity}
                      </span>
                    </span>
                    <span>{formatCurrency(item.totalPrice)}</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {address && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">
                  {address.fullName}
                </p>
                <p>
                  {address.street}, {address.city}, {address.state}{" "}
                  {address.postalCode}, {address.country}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-base">Order Total</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(order.subTotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Discount</span>
              <span>-{formatCurrency(order.discount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatCurrency(order.shippingFee)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>{formatCurrency(order.total)}</span>
            </div>

            {canCancel && (
              <Button
                variant="destructive"
                className="w-full mt-4"
                disabled={cancelOrder.isPending}
                onClick={() => cancelOrder.mutate(order._id)}
              >
                Cancel Order
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Link href="/orders" className="text-sm text-primary hover:underline">
          &larr; Back to orders
        </Link>
      </div>
    </div>
  );
}

export default function OrderDetailPage() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}
