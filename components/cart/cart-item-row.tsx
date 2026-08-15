"use client";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRemoveCartItem, useUpdateCartItem } from "@/hooks/use-cart";
import type { CartItem } from "@/types/cart.type";
import type { Product } from "@/types/product.type";
import { formatCurrency } from "@/utils/currency-format";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const product =
    typeof item.productId === "string" ? null : (item.productId as Product);
  const productId =
    typeof item.productId === "string" ? item.productId : item.productId._id;

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
        {product?.thumbnail && (
          <Image
            src={product.thumbnail}
            alt={product.name}
            fill
            priority
            sizes="100%"
            className="object-cover"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${product?.slug ?? productId}`}
          className="font-medium hover:underline line-clamp-1"
        >
          {product?.name ?? "Product"}
        </Link>
        <p className="text-sm text-muted-foreground">
          {formatCurrency(item.priceSnapshot)} each
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={item.quantity <= 1 || updateItem.isPending}
          onClick={() =>
            updateItem.mutate({ itemId: item._id, quantity: item.quantity - 1 })
          }
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-6 text-center">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled={updateItem.isPending}
          onClick={() =>
            updateItem.mutate({ itemId: item._id, quantity: item.quantity + 1 })
          }
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      <div className="w-24 text-right font-medium">
        {formatCurrency(item.priceSnapshot * item.quantity)}
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem.mutate(item._id)}
        disabled={removeItem.isPending}
        className="ml-4"
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
