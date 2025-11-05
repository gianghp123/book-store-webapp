import { User } from "@/features/users/dtos/response/user-response.dto";
import { Product } from "@/features/products/dtos/response/product-response.dto";
export interface OrderProduct {
  id: string; // UUID
  title: string;
  description?: string;
  price: number;
  rating: number;
  ratingCount: number;
  createdAt: string; // date
  updatedAt: string; // date
}

// Order item interface
export interface OrderItem {
  id: string; // UUID
  product: Product;
  price: number;
}

// Base order interface
export interface Order {
  id: string; // UUID
  user: User;
  orderDate: string; // date
  totalAmount: number;
  status: string;
  items: OrderItem[];
}

// Response for order creation and retrieval
export interface OrderResponse extends Order {}

// Paginated orders response
export interface PaginatedOrdersResponse {
  data: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}