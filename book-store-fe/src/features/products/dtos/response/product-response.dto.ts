import { ProductCategory } from "@/features/categories/dtos/response/category.dto";

// Author interface for products
export interface ProductAuthor {
  id: string; // UUID
  name: string;
}

export interface ProductBook {
  isbn?: string;
  publisher?: string;
  pagesCount?: number;
}

// Product response interface
export interface Product {
  id: string; // UUID
  image: string;
  title: string;
  description?: string;
  price: number;
  rating: number;
  ratingCount: number;
  book?: ProductBook;
  createdAt: string; // date
  updatedAt: string; // date
  categories: ProductCategory[];
  authors: ProductAuthor[];
  reviews: ProductReview[];
}

export interface ProductReview {
  username: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

// Response for product creation and retrieval
export interface ProductResponse extends Product {}

// Paginated products response
export interface PaginatedProductsResponse {
  data: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Response for hybrid search (array of products)
export interface HybridSearchResponse extends Array<Product> {}