import { User } from "./user.type";

export interface Review {
  _id: string;
  userId: string | User;
  productId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewSummary {
  average: number;
  totalCount: number;
  distribution: Record<number, number>;
}
