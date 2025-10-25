// Category interface for responses
export interface Category {
  id: string; // UUID
  name: string;
}

// Response for category operations
export interface CategoryResponse extends Category {}

// Paginated categories response
export interface PaginatedCategoriesResponse {
  data: Category[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}