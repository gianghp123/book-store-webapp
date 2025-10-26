import { Product } from "@/features/products/dtos/response/product-response.dto";

// Cart item interface
export interface CartItem {
  id: string; // UUID
  product: Product;
}

// Cart response interface
export interface CartResponse {
  id: string; // UUID
  items: CartItem[];
  total: number;
  createdAt: string; // date
}

// Response for removing item from cart
export interface RemoveFromCartResponse {
  id: string; // UUID
  product: Product;
}