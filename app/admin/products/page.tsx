"use client";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useProducts } from "@/hooks/use-products";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { productsApi } from "@/api/products";
import { getApiErrorMessage } from "@/api/client";
import { formatCurrency } from "@/utils/currency-format";
import { Product } from "@/types/product.type";

export default function AdminProductsPage() {
  const [page, setPage] = useState(1);
  // NOTE: the backend's GET /products only ever returns isActive:true items (public storefront
  // listing) — there's no separate "admin sees everything including deactivated" endpoint yet.
  const { data, isLoading } = useProducts({
    page,
    limit: 20,
    sortBy: "createdAt",
    sort: "desc",
  });
  const queryClient = useQueryClient();

  const [deactivateTarget, setDeactivateTarget] = useState<
    Product | undefined
  >();
  const [isDeactivating, setIsDeactivating] = useState(false);

  async function handleConfirmDeactivate() {
    if (!deactivateTarget) return;
    setIsDeactivating(true);
    try {
      await productsApi.remove(deactivateTarget._id);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      toast.success("Product deactivated");
      setDeactivateTarget(undefined);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsDeactivating(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button asChild>
          <Link href="/admin/products/new">Add Product</Link>
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.items.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{product.sku}</TableCell>
                <TableCell>
                  {formatCurrency(product.discountPrice ?? product.price)}
                </TableCell>
                <TableCell>{product.stockQuantity}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/products/${product._id}/edit`}>
                      Edit
                    </Link>
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setDeactivateTarget(product)}
                  >
                    Deactivate
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {data && data.meta.totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= data.meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <AlertDialog
        open={!!deactivateTarget}
        onOpenChange={(open) => !open && setDeactivateTarget(undefined)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate product?</AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {deactivateTarget?.name}
              </span>{" "}
              will no longer be visible to customers. You can reactivate it
              later from the product edit page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeactivating}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeactivate}
              disabled={isDeactivating}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeactivating ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
