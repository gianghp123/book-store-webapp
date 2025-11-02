import { Product } from "@/features/products/dtos/response/product-response.dto";
import { User } from "@/features/users/dtos/response/user-response.dto";

export interface CartItem {
  id: string; // UUID
  product: Product;
}

export interface CartResponse {
  id: string; // UUID
  items: CartItem[];
  total: number;
  user: User;
  createdAt: string; // date
}

export interface RemoveFromCartResponse {
  id: string; // UUID
  product: Product;
}