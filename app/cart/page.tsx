"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProtectedRoute } from "@/components/common/protected-route";
import { CartItemRow } from "@/components/cart/cart-item-row";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart, useClearCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/utils/currency-format";

function CartContent() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const clearCart = useClearCart();

  if (isLoading) {
    return (
      <div className="container py-8 space-y-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <h1 className="mb-2 text-2xl font-bold">Your cart is empty</h1>
        <p className="mb-6 text-muted-foreground">
          Looks like you haven&apos;t added anything yet.
        </p>
        <Button>
          <Link href="/products">Start Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Shopping Cart</h1>
        <Button variant="ghost" onClick={() => clearCart.mutate()}>
          Clear cart
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {cart.items.map((item) => (
            <CartItemRow key={item._id} item={item} />
          ))}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatCurrency(cart.subTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Shipping and tax are calculated at checkout.
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push("/checkout")}>
              Proceed to Checkout
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartContent />
    </ProtectedRoute>
  );
}
