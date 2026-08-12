"use client";
import { categoriesApi } from "@/api/categories";
import { type ProductQuery, productsApi } from "@/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProducts(query: ProductQuery) {
  return useQuery({
    queryKey: ["products", query],
    queryFn: () => productsApi.list(query),
    placeholderData: (prev) => prev,
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["product", slug],
    queryFn: () => productsApi.getBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => categoriesApi.list(),
  });
}

export function useCategoryTree() {
  return useQuery({
    queryKey: ["categories", "tree"],
    queryFn: () => categoriesApi.tree(),
  });
}
