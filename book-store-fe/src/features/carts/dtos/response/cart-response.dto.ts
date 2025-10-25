// Product interface for cart items
export interface CartProduct {
  id: string; // UUID
  title: string;
  description?: string;
  price: number;
  rating: number;
  ratingCount: number;
  createdAt: string; // date
  updatedAt: string; // date
  categories: {
    id: string; // UUID
    name: string;
  }[];
  authors: {
    id: string; // UUID
    name: string;
  }[];
}

// Cart item interface
export interface CartItem {
  id: string; // UUID
  product: CartProduct;
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
  product: CartProduct;
}