// src/features/orders/services/orderService.ts
import { apiFetch } from "@/lib/api-fetch";
import { ServerResponseModel } from "@/lib/typedefs/server-response";
// Import DTO request (định nghĩa input)
import { CreateOrderDto } from "../dtos/request/order.dto";
// Import DTO response (định nghĩa output)
import { OrderResponse } from "../dtos/response/order-response.dto";

/**
 * Tạo một đơn hàng mới từ các item trong giỏ hàng.
 * Yêu cầu xác thực (withCredentials: true).
 */
const createOrder = async (
  dto: CreateOrderDto
): Promise<ServerResponseModel<OrderResponse>> => {
  const response = await apiFetch<OrderResponse>("/orders", {
    method: "POST",
    withCredentials: true, // Bắt buộc để gửi token
    body: JSON.stringify(dto), // Gửi { items: [{ productId: "..." }] }
  });
  return response;
};

export const orderService = {
  createOrder,
};