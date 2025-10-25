// Item for creating an order
export interface OrderItemDto {
  productId: string; // UUID
}

// Create order request
export interface CreateOrderDto {
  items: OrderItemDto[];
  cartId: string; // UUID
}

// Cancel order request
export interface CancelOrderDto {
  orderId: string; // UUID
}