"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCategories } from "@/hooks/use-products";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { type ProductPayload, productsApi } from "@/api/products";
import type { Product } from "@/types/product.type";
import { getApiErrorMessage } from "@/api/client";

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: categories } = useCategories();
  const [isSaving, setIsSaving] = useState(false);
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(
    product?.thumbnail ?? null,
  );

  const [form, setForm] = useState<ProductPayload>({
    categoryId: product?.categoryId ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    sku: product?.sku ?? "",
    brand: product?.brand ?? "",
    price: product?.price ?? 0,
    discountPrice: product?.discountPrice ?? undefined,
    stockQuantity: product?.stockQuantity ?? 0,
  });

  function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image must be under 5MB");
      e.target.value = "";
      return;
    }
    // Release the previous blob URL before creating a new one to avoid leaking memory.
    if (thumbnailPreview && thumbnailPreview.startsWith("blob:")) {
      URL.revokeObjectURL(thumbnailPreview);
    }
    setThumbnail(file);
    setThumbnailPreview(
      file ? URL.createObjectURL(file) : (product?.thumbnail ?? null),
    );
  }

  function handleChange<K extends keyof ProductPayload>(
    field: K,
    value: ProductPayload[K],
  ) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (form.discountPrice != null && form.discountPrice >= form.price) {
      toast.error("Discount price must be lower than the regular price");
      return;
    }
    if (!product && !thumbnail) {
      toast.error("Please upload a thumbnail image");
      return;
    }

    setIsSaving(true);
    try {
      if (product) {
        await productsApi.update(product._id, form);
        if (thumbnail) {
          try {
            await productsApi.updateThumbnail(product._id, thumbnail);
          } catch (thumbError) {
            toast.error(
              "Product saved, but thumbnail upload failed. Try uploading it again.",
            );
            queryClient.invalidateQueries({ queryKey: ["products"] });
            return;
          }
        }
        toast.success("Product updated");
      } else {
        await productsApi.create(form, thumbnail ?? undefined);
        toast.success("Product created");
      }
      queryClient.invalidateQueries({ queryKey: ["products"] });
      router.push("/admin/products");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Product name</Label>
        <Input
          id="name"
          required
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select
          value={form.categoryId}
          onValueChange={(v) => handleChange("categoryId", v)}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories?.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={4}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input
            id="sku"
            required
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand (optional)</Label>
          <Input
            id="brand"
            value={form.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            min={0}
            step="0.01"
            required
            value={form.price === 0 ? "" : form.price}
            onChange={(e) =>
              handleChange(
                "price",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPrice">Discount price (optional)</Label>
          <Input
            id="discountPrice"
            type="number"
            min={0}
            step="0.01"
            value={form.discountPrice ?? ""}
            onChange={(e) =>
              handleChange(
                "discountPrice",
                e.target.value ? Number(e.target.value) : undefined,
              )
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="stockQuantity">Stock quantity</Label>
          <Input
            id="stockQuantity"
            type="number"
            min={0}
            required
            value={form.stockQuantity === 0 ? "" : form.stockQuantity}
            onChange={(e) =>
              handleChange(
                "stockQuantity",
                e.target.value === "" ? 0 : Number(e.target.value),
              )
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="thumbnail">
          {product ? "Replace thumbnail (optional)" : "Thumbnail image"}
        </Label>
        {thumbnailPreview && (
          <img
            src={thumbnailPreview}
            alt="Thumbnail preview"
            className="h-24 w-24 rounded-md border object-cover"
          />
        )}
        <Input
          id="thumbnail"
          type="file"
          accept="image/*"
          onChange={handleThumbnailChange}
        />
      </div>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSaving}>
          {isSaving
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
