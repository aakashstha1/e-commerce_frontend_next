import type { Product } from "@/types/product.type";
import { ProductCard } from "./product-card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductGrid({
  products,
  isLoading,
}: {
  products?: Product[];
  isLoading?: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full" />
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No products found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
