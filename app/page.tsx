"use client";
import Link from "next/link";
// import { Truck, ShieldCheck, RotateCcw } from "lucide-react";
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
      <section className="relative overflow-hidden bg-[#0B0F14] text-[#F3EFE7] rounded-xl mt-2">
        {/* subtle dot texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:radial-gradient(circle,#F3EFE7_1px,transparent_1px)] [background-size:22px_22px]"
        />
        {/* soft glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#D8A448]/20 blur-[120px]"
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 sm:py-14 lg:px-8">
          <div className="max-w-2xl">
            {/* signature: ticket-style badge */}
            <div className="mb-6 inline-flex -rotate-2 items-center gap-2 rounded-sm border border-dashed border-[#D8A448]/50 bg-[#D8A448]/10 px-3 py-1.5">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#D8A448]" />
              <span className="text-xs font-medium tracking-wide text-[#D8A448]">
                Premium Quality Guaranteed
              </span>
            </div>

            <h1 className="text-[2.75rem] font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Shop the essentials
              <br />
              <span className="font-serif text-[#D8A448] italic font-normal">
                and everything after.
              </span>
            </h1>

            <p className="mt-5 max-w-md text-lg text-[#F3EFE7]/80">
              Discover quality products, quick delivery, and great value all in
              one place.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button
                size="lg"
                asChild
                className="bg-[#D8A448] text-[#0B0F14] hover:bg-[#D8A448]/90 focus-visible:ring-[#D8A448]"
              >
                <Link href="/products">Browse products</Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                asChild
                className="text-[#F3EFE7] hover:bg-white/10 hover:text-[#F3EFE7] focus-visible:ring-[#D8A448]"
              >
                <Link href="#categories">Shop by category</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {categories && categories.length > 0 && (
        <section
          id="categories"
          className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8"
        >
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

      <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
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
