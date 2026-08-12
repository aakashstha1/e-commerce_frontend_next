export interface ProductImage {
  _id: string;
  productId: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Product {
  _id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  sku: string;
  brand?: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  thumbnail?: string;
  isActive: boolean;
  images?: ProductImage[];
  createdAt: string;
  updatedAt: string;
}
