"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { StarRating } from "@/components/product/star-rating";
import { useProduct } from "@/hooks/use-products";
import { useAddToCart } from "@/hooks/use-cart";
import {
  useAddToWishlist,
  useRemoveFromWishlist,
  useWishlist,
} from "@/hooks/use-wishlist";
import {
  useCreateReview,
  useProductReviews,
  useReviewSummary,
} from "@/hooks/use-reviews";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/utils/currency-format";
import { formatDate } from "@/utils/date-format";
import type { User } from "@/types/user.type";

export default function ProductDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  const { data: product, isLoading } = useProduct(params.slug);
  const { data: wishlist } = useWishlist();
  const { data: reviews } = useProductReviews(product?._id ?? "");
  const { data: summary } = useReviewSummary(product?._id ?? "");

  const addToCart = useAddToCart();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();
  const createReview = useCreateReview();

  if (isLoading || !product) {
    return (
      <div className="container py-8 grid gap-8 md:grid-cols-2">
        <Skeleton className="aspect-square w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

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
  const images = product.images?.length ? product.images : [];

  function requireAuth() {
    if (!accessToken) {
      router.push("/login");
      return false;
    }
    return true;
  }

  function handleAddToCart() {
    if (!requireAuth()) return;
    addToCart.mutate({ productId: product!._id, quantity });
  }

  function handleWishlistToggle() {
    if (!requireAuth()) return;
    if (isWishlisted) removeFromWishlist.mutate(product!._id);
    else addToWishlist.mutate(product!._id);
  }

  function handleSubmitReview(e: React.FormEvent) {
    e.preventDefault();
    if (!requireAuth()) return;
    createReview.mutate(
      {
        productId: product!._id,
        rating: reviewRating,
        comment: reviewComment || undefined,
      },
      { onSuccess: () => setReviewComment("") },
    );
  }

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-muted">
            {(images[activeImage]?.imageUrl ?? product.thumbnail) ? (
              <Image
                src={images[activeImage]?.imageUrl ?? product.thumbnail!}
                alt={product.name}
                fill
                sizes="100vh"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2">
              {images.map((img, i) => (
                <button
                  key={img._id}
                  onClick={() => setActiveImage(i)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-md border-2",
                    activeImage === i ? "border-primary" : "border-transparent",
                  )}
                >
                  <Image
                    src={img.imageUrl}
                    alt=""
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          {product.brand && (
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          )}
          <h1 className="text-2xl font-bold">{product.name}</h1>

          {summary && summary.totalCount > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <StarRating
                value={Math.round(summary.average)}
                readOnly
                size={16}
              />
              <span className="text-sm text-muted-foreground">
                {summary.average.toFixed(1)} ({summary.totalCount} reviews)
              </span>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold">{formatCurrency(price)}</span>
            {hasDiscount && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(product.price)}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm">
            {outOfStock ? (
              <span className="text-destructive">Out of stock</span>
            ) : (
              <span className="text-green-600">
                {product.stockQuantity} in stock
              </span>
            )}
          </p>

          <p className="mt-4 text-muted-foreground">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                }
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <Button
              disabled={outOfStock || addToCart.isPending}
              onClick={handleAddToCart}
              className="flex-1"
            >
              Add to Cart
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={handleWishlistToggle}
            >
              <Heart
                className={cn(
                  "h-5 w-5",
                  isWishlisted && "fill-red-500 text-red-500",
                )}
              />
            </Button>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            SKU: {product.sku}
          </p>
        </div>
      </div>

      <Separator className="my-10" />

      <div>
        <h2 className="mb-4 text-xl font-semibold">Customer Reviews</h2>

        {accessToken && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-8 space-y-3 rounded-lg border p-4"
          >
            <p className="font-medium">Write a review</p>
            <StarRating value={reviewRating} onChange={setReviewRating} />
            <Textarea
              placeholder="Share your thoughts about this product..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
            />
            <Button type="submit" disabled={createReview.isPending}>
              Submit Review
            </Button>
            <p className="text-xs text-muted-foreground">
              Note: you can only review products from orders that have been
              delivered to you.
            </p>
          </form>
        )}

        <div className="space-y-4">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => {
              const reviewer =
                typeof review.userId === "string"
                  ? null
                  : (review.userId as User);
              return (
                <div key={review._id} className="border-b pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">
                      {reviewer?.name ?? "Anonymous"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <StarRating value={review.rating} readOnly size={14} />
                  {review.comment && (
                    <p className="mt-1 text-sm">{review.comment}</p>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review this product!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
