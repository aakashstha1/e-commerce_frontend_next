'use client';
import { useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductGrid } from '@/components/product/product-grid';
import { Pagination } from '@/components/common/pagination';
import { useProducts, useCategories } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';

function ProductsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get('page') ?? '1');
  const search = searchParams.get('search') ?? '';
  const categoryId = searchParams.get('categoryId') ?? '';
  const sortBy = (searchParams.get('sortBy') ?? 'createdAt') as 'createdAt' | 'price' | 'name';
  const sort = (searchParams.get('sort') ?? 'desc') as 'asc' | 'desc';

  const query = useMemo(
    () => ({ page, limit: 12, search: search || undefined, categoryId: categoryId || undefined, sortBy, sort }),
    [page, search, categoryId, sortBy, sort],
  );

  const { data, isLoading } = useProducts(query);
  const { data: categories } = useCategories();

  function updateParams(patch: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(patch).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    if (!('page' in patch)) params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div className="container py-8">
      <h1 className="mb-6 text-2xl font-bold">All Products</h1>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          placeholder="Search products..."
          defaultValue={search}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateParams({ search: (e.target as HTMLInputElement).value });
          }}
          className="sm:max-w-xs"
        />

        <Select value={categoryId || 'all'} onValueChange={(v) => updateParams({ categoryId: v === 'all' ? undefined : v })}>
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={`${sortBy}-${sort}`}
          onValueChange={(v) => {
            const [newSortBy, newSort] = v.split('-');
            updateParams({ sortBy: newSortBy, sort: newSort });
          }}
        >
          <SelectTrigger className="sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A-Z</SelectItem>
          </SelectContent>
        </Select>

        {(search || categoryId) && (
          <Button variant="ghost" onClick={() => router.push('/products')}>
            Clear filters
          </Button>
        )}
      </div>

      <ProductGrid products={data?.items} isLoading={isLoading} />

      {data && (
        <Pagination
          page={data.meta.page}
          totalPages={data.meta.totalPages}
          onPageChange={(p) => updateParams({ page: String(p) })}
        />
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
}
