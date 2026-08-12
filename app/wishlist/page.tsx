"use client";
import Link from "next/link";
import Image from "next/image";
import { ProtectedRoute } from "@/components/common/protected-route";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist, useRemoveFromWishlist } from "@/hooks/use-wishlist";
import { useAddToCart } from "@/hooks/use-cart";
import { formatCurrency } from "@/utils/currency-format";
import type { Product } from "@/types/product.type";

function WishlistContent() {
  const { data, isLoading } = useWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const addToCart = useAddToCart();

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
        <h1 className="mb-2 text-2xl font-bold">Your wishlist is empty</h1>
        <Link href="/products" className="text-primary hover:underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">My Wishlist</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((item) => {
          const product =
            typeof item.productId === "string"
              ? null
              : (item.productId as Product);
          if (!product) return null;
          return (
            <div key={item._id} className="flex gap-3 rounded-lg border p-3">
              <Link
                href={`/products/${product.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted"
              >
                {product.thumbnail && (
                  <Image
                    src={product.thumbnail}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
              </Link>
              <div className="flex-1">
                <Link
                  href={`/products/${product.slug}`}
                  className="font-medium hover:underline line-clamp-1"
                >
                  {product.name}
                </Link>
                <p className="text-sm font-semibold">
                  {formatCurrency(product.discountPrice ?? product.price)}
                </p>
                <div className="mt-2 flex gap-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      addToCart.mutate({ productId: product._id, quantity: 1 })
                    }
                    disabled={product.stockQuantity <= 0}
                  >
                    Add to cart
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeFromWishlist.mutate(product._id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function WishlistPage() {
  return (
    <ProtectedRoute>
      <WishlistContent />
    </ProtectedRoute>
  );
}
