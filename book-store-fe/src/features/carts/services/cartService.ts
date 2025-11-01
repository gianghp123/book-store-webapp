import { apiFetch } from "@/lib/api-fetch";
import { ServerResponseModel } from "@/lib/typedefs/server-response";
import { AddToCartDto } from "../dtos/request/add-to-cart.dto";
import { RemoveFromCartDto } from "../dtos/request/remove-from-cart.dto";
import { CartItem, CartResponse } from "../dtos/response/cart-response.dto";

class CartService {
  getCart = async (): Promise<ServerResponseModel<CartResponse>> => {
    const response = await apiFetch<CartResponse>("/carts/me", {
      method: "GET",
      withCredentials: true,
      cache: "no-store",
    });
    return response;
  };

  addItemToCart = async (
    dto: AddToCartDto
  ): Promise<ServerResponseModel<CartResponse>> => {
    const response = await apiFetch<CartResponse>("/carts", {
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
  removeItemFromCart = async (
    dto: RemoveFromCartDto
  ): Promise<ServerResponseModel<CartItem>> => {
    // Backend trả về item đã xóa
    const response = await apiFetch<CartItem>("/carts", {
      method: "DELETE",
      withCredentials: true, // Bắt buộc để gửi token
      body: JSON.stringify(dto), // Gửi { productId: "..." }
    });
    return response;
  };

  getItemsCount = async (): Promise<ServerResponseModel<number>> => {
    const response = await apiFetch<number>("/carts/items-count", {
      method: "GET",
      withCredentials: true,
      cache: "no-store",
    });
    return response;
  };

  clearCart = async (): Promise<ServerResponseModel<CartResponse>> => {
    const response = await apiFetch<CartResponse>("/carts/clear", {
      method: "DELETE",
      withCredentials: true,
      cache: "no-store",
    });
    return response;
  };
}

export const cartService = new CartService();
