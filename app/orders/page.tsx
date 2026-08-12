"use client";
import Link from "next/link";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderStatusBadge } from "@/components/common/order-status-badge";
import { useMyOrders } from "@/hooks/use-orders";
import { formatCurrency } from "@/utils/currency-format";
import { formatDate } from "@/utils/date-format";

function OrdersContent() {
  const { data, isLoading } = useMyOrders({ limit: 20 });

  if (isLoading) {
    return (
      <div className="container py-8 space-y-3">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">No orders yet</h1>
        <Link href="/products" className="text-primary hover:underline">
          Start shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
      <div className="flex flex-col gap-4">
        {data.items.map((order) => (
          <Link key={order._id} href={`/orders/${order._id}`}>
            <Card className="transition-shadow hover:shadow-md">
              <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                <div>
                  <p className="font-medium">{order.orderNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    Placed on {formatDate(order.placedAt)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
                <p className="font-semibold">{formatCurrency(order.total)}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
