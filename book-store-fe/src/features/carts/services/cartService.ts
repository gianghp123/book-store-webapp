// src/features/carts/services/cartService.ts
import { apiFetch } from "@/lib/api-fetch";
import { ServerResponseModel } from "@/lib/typedefs/server-response";
// Sửa import, DTO của backend/frontend không nhất quán, dùng DTO của frontend
import { CartResponse, CartItem } from "../dtos/response/cart-response.dto";
import { AddToCartDto } from "../dtos/request/add-to-cart.dto";
// Import DTO để xóa
import { RemoveFromCartDto } from "../dtos/request/remove-from-cart.dto";

/**
 * Lấy giỏ hàng của người dùng hiện tại (đã đăng nhập).
 * Yêu cầu xác thực (withCredentials: true).
 */
const getCart = async (): Promise<ServerResponseModel<CartResponse>> => {
  const response = await apiFetch<CartResponse>("/cart/me", {
    method: "GET",
    withCredentials: true, // Bắt buộc để gửi token xác thực
    cache: "no-store",
  });
  return response;
};

/**
 * Thêm một sản phẩm vào giỏ hàng của người dùng hiện tại.
 * Yêu cầu xác thực (withCredentials: true).
 */
const addItemToCart = async (
  dto: AddToCartDto
): Promise<ServerResponseModel<CartResponse>> => {
  const response = await apiFetch<CartResponse>("/cart", {
    method: "POST",
    withCredentials: true, // Bắt buộc để gửi token
    body: JSON.stringify(dto), // Gửi { productId: "..." }
  });
  return response;
};

/**
 * Xóa một sản phẩm khỏi giỏ hàng của người dùng hiện tại.
 * Yêu cầu xác thực (withCredentials: true).
 */
const removeItemFromCart = async (
  dto: RemoveFromCartDto
): Promise<ServerResponseModel<CartItem>> => { // Backend trả về item đã xóa
  const response = await apiFetch<CartItem>("/cart", {
    method: "DELETE",
    withCredentials: true, // Bắt buộc để gửi token
    body: JSON.stringify(dto), // Gửi { productId: "..." }
  });
  return response;
};


export const cartService = {
  getCart,
  addItemToCart,
  removeItemFromCart, // <-- Xuất hàm mới
};