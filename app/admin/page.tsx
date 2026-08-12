"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProducts } from "@/hooks/use-products";
import { useAllOrders } from "@/hooks/use-orders";
import { OrderStatus } from "@/types/order.type";

export default function AdminDashboardPage() {
  const { data: products } = useProducts({ limit: 1 });
  const { data: orders } = useAllOrders({ limit: 1 });
  const { data: pendingOrders } = useAllOrders({
    limit: 1,
    status: OrderStatus.PENDING,
  });

  const stats = [
    {
      label: "Total Products",
      value: products?.meta.total ?? "—",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: orders?.meta.total ?? "—",
      href: "/admin/orders",
    },
    {
      label: "Pending Orders",
      value: pendingOrders?.meta.total ?? "—",
      href: "/admin/orders?status=pending",
    },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
