import { SearchType } from "@/lib/constants/enums";

// Product creation request
export interface CreateProductDto {
  title: string;
  description?: string;
  descriptionSummary?: string;
  price: number; // minimum 0
  categoryIds?: string[]; // array of UUIDs
  authorIds?: string[]; // array of UUIDs
}

// Product filter query parameters
export interface ProductFilterQueryDto {
  query?: string;
  page?: number; // optional, default: 1
  limit?: number; // optional, default: 10
  title?: string;
  categoryIds?: string[]; // array of UUIDs
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC'; // enum: ASC, DESC
  searchType?: SearchType;
}

// Hybrid search query parameters
export interface HybridSearchQueryDto {
  query: string; // required
  limit?: number;
}