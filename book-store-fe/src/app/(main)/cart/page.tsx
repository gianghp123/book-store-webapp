// src/app/(main)/cart/page.tsx
import { ShoppingCart1 } from "@/features/carts/components/Cart";
import { cartService } from "@/features/carts/services/cartService";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";

// Sử dụng fallback URL nếu ảnh bị lỗi
const IMAGE_FALLBACK_URL =
  "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public";

// Chuyển thành async function để fetch dữ liệu trên server
export default async function CartPage() {
  let cartData: CartResponse | null = null;

  try {
    const response = await cartService.getCart();
    if (response.success && response.data) {
      cartData = response.data;
    } else {
      // Ghi log lỗi nếu có, ví dụ: 404 (chưa có giỏ hàng) hoặc 401 (chưa đăng nhập)
      console.warn("Failed to fetch cart:", response.message);
    }
  } catch (error: any) {
    console.error("Error fetching cart data:", error.message);
  }

  return (
    <ShoppingCart1
      cartResponse={cartData}
      imageFallbackUrl={IMAGE_FALLBACK_URL}
    />
  );
}