"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  OrderStatusBadge,
  PaymentStatusBadge,
} from "@/components/common/order-status-badge";
import { useAllOrders, useUpdateOrderStatus } from "@/hooks/use-orders";
import { useMarkCodPaid } from "@/hooks/use-payments";
import { OrderStatus } from "@/types/order.type";
import { PaymentMethod, PaymentStatus } from "@/types/payment.type";
import type { User } from "@/types/user.type";
import { formatDate } from "@/utils/date-format";
import { formatCurrency } from "@/utils/currency-format";

const statusOptions = Object.values(OrderStatus);

const nextStatuses: Record<OrderStatus, OrderStatus[]> = {
  [OrderStatus.PENDING]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],
  [OrderStatus.PROCESSING]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],
  [OrderStatus.SHIPPED]: [OrderStatus.DELIVERED],
  [OrderStatus.DELIVERED]: [],
  [OrderStatus.CANCELLED]: [],
};

export default function AdminOrdersPage() {
  type StatusFilter = "all" | OrderStatus;
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const { data, isLoading } = useAllOrders({
    limit: 50,
    status: statusFilter === "all" ? undefined : statusFilter,
  });
  const updateStatus = useUpdateOrderStatus();
  const markCodPaid = useMarkCodPaid();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Select
          value={statusFilter as string}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Update Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((order) => {
              const customer =
                typeof order.userId === "string"
                  ? null
                  : (order.userId as User);
              const available = nextStatuses[order.status];
              return (
                <TableRow key={order._id}>
                  <TableCell>
                    <Link
                      href={`/orders/${order._id}`}
                      className="font-medium hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </TableCell>
                  <TableCell>{customer?.name ?? "—"}</TableCell>
                  <TableCell>{formatDate(order.placedAt)}</TableCell>
                  <TableCell>{formatCurrency(order.total)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-xs uppercase text-muted-foreground">
                        {order.paymentMethod}
                      </span>
                      <PaymentStatusBadge status={order.paymentStatus} />
                      {order.paymentMethod === PaymentMethod.COD &&
                        order.paymentStatus === PaymentStatus.PENDING && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={markCodPaid.isPending}
                            onClick={() => markCodPaid.mutate(order._id)}
                          >
                            Mark Paid
                          </Button>
                        )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {available.length > 0 ? (
                      <div className="flex justify-end gap-2">
                        {available.map((status) => (
                          <Button
                            key={status}
                            size="sm"
                            variant="outline"
                            disabled={updateStatus.isPending}
                            onClick={() =>
                              updateStatus.mutate({ id: order._id, status })
                            }
                          >
                            Mark {status}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        No actions
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
