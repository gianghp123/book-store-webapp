import { ProductCategory } from "@/features/categories/dtos/response/category.dto";

export interface ProductAuthor {
  id: string;
  name: string;
}

export interface ProductReview {
  username: string;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface Product {
  id: string;
  image?: string;
  title: string;
  description?: string;
  price?: number;
  rating?: number;
  ratingCount?: number;
  isbn?: string;
  publisher?: string;
  pagesCount?: number;
  createdAt?: string;
  updatedAt?: string;
  categories?: ProductCategory[];
  authors?: ProductAuthor[];
  reviews?: ProductReview[];
}

export interface ProductResponse extends Product {}

export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface HybridSearchResponse extends Array<Product> {}
