// Author interface for responses
export interface Author {
  id: string; // UUID
  name: string;
}

// Response for author operations
export interface AuthorResponse extends Author {}

// Paginated authors response
export interface PaginatedAuthorsResponse {
  data: Author[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}