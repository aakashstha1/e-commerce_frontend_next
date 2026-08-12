'use client';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { ProductForm } from '@/components/admin/product-form';
import { Skeleton } from '@/components/ui/skeleton';
import { productsApi } from '@/api/products';

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', 'id', params.id],
    queryFn: () => productsApi.getById(params.id),
  });

  if (isLoading || !product) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96 w-full max-w-2xl" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
