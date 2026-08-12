"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAddToCart } from "@/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/use-wishlist";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";
import type { Product } from "@/types/product.type";
import { formatCurrency } from "@/utils/currency-format";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const { data: wishlist } = useWishlist();

  const isWishlisted = wishlist?.items?.some(
    (item) =>
      (typeof item.productId === "string"
        ? item.productId
        : item.productId._id) === product._id,
  );

  const price = product.discountPrice ?? product.price;
  const hasDiscount =
    !!product.discountPrice && product.discountPrice < product.price;
  const outOfStock = product.stockQuantity <= 0;

  function handleWishlistToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (!accessToken) return router.push("/login");
    if (isWishlisted) removeFromWishlist.mutate(product._id);
    else addToWishlist.mutate(product._id);
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    if (!accessToken) return router.push("/login");
    addToCart.mutate({ productId: product._id, quantity: 1 });
  }

  return (
    <Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square w-full overflow-hidden bg-muted">
          {product.thumbnail ? (
            <Image
              src={product.thumbnail}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No image
            </div>
          )}
          <button
            onClick={handleWishlistToggle}
            className="absolute right-2 top-2 rounded-full bg-white/90 p-2 shadow hover:bg-white"
          >
            <Heart
              className={cn(
                "h-4 w-4",
                isWishlisted ? "fill-red-500 text-red-500" : "text-gray-600",
              )}
            />
          </button>
          {outOfStock && (
            <div className="absolute left-2 top-2 rounded bg-black/80 px-2 py-1 text-xs text-white">
              Out of stock
            </div>
          )}
        </div>
        <CardContent className="p-4">
          {product.brand && (
            <p className="text-xs text-muted-foreground">{product.brand}</p>
          )}
          <h3 className="line-clamp-1 font-medium">{product.name}</h3>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-semibold">{formatCurrency(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          size="sm"
          disabled={outOfStock || addToCart.isPending}
          onClick={handleAddToCart}
        >
          {outOfStock ? "Out of stock" : "Add to cart"}
        </Button>
      </CardFooter>
    </Card>
  );
}
