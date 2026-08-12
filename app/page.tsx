"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useProducts, useCategories } from "@/hooks/use-products";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const { data, isLoading } = useProducts({
    limit: 8,
    sortBy: "createdAt",
    sort: "desc",
  });
  const { data: categories } = useCategories();

  return (
    <div>
      <section className="bg-gradient-to-r from-slate-900 to-slate-700 text-white">
        <div className="container flex flex-col items-start gap-4 py-20 px-10">
          <h1 className="text-4xl font-bold sm:text-5xl">
            Shop everything you need.
          </h1>
          <p className="max-w-md text-slate-200">
            Quality products, fast delivery, and a shopping experience built
            around you.
          </p>
          <Button size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section className="container py-10">
          <h2 className="mb-4 text-xl font-semibold">Shop by Category</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                href={`/products?categoryId=${category._id}`}
              >
                <Card className="text-center transition-shadow hover:shadow-md">
                  <CardContent className="p-4">
                    <p className="font-medium">{category.name}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container py-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">New Arrivals</h2>
          <Link
            href="/products"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        <ProductGrid products={data?.items} isLoading={isLoading} />
      </section>
    </div>
  );
}
