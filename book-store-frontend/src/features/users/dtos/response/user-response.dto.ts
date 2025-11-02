// User interface for responses
export interface User {
  id: string; // UUID
  fullName: string;
  email: string;
  phoneNumber?: string;
  role: string; // Role enum
  createdAt: string; // date
  updatedAt: string; // date
}

// Response for getting user
export interface UserResponse extends User {}

// Paginated users response
export interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}