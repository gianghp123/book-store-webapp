// src/app/(main)/payment/page.tsx
import { PaymentForm1 } from "@/features/orders/components/PaymentForm";
import { cartService } from "@/features/carts/services/cartService";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { redirect } from "next/navigation";

// Biến trang này thành một Server Component `async`
export default async function PaymentPage() {
  let cartData: CartResponse | null = null;
  const IMAGE_FALLBACK_URL =
    "https://imagedelivery.net/Kpcbofvpelk1jdjXmWIr5w/15656e6c-1315-435d-fa59-ec0ce2ac0700/public";

  try {
    // 1. Gọi API /cart/me
    const response = await cartService.getCart();
    
    if (response.success && response.data) {
      cartData = response.data;
    }

    // 2. Nếu không có giỏ hàng, hoặc giỏ hàng rỗng, quay lại trang /cart
    if (!cartData || cartData.items.length === 0) {
      console.warn("Payment page: No cart data or cart is empty. Redirecting.");
      redirect("/cart");
    }
  } catch (error: any) {
    console.error("Payment page: Error fetching cart data:", error.message);
    // 3. Nếu lỗi (ví dụ 401 chưa đăng nhập), chuyển về trang login
    if (error.message.includes("401") || error.statusCode === 401) {
      redirect("/login");
    }
    // Lỗi khác thì quay về giỏ hàng
    redirect("/cart");
  }

  // 4. Truyền dữ liệu thật xuống component
  return (
    <PaymentForm1
      cartData={cartData}
      imageFallbackUrl={IMAGE_FALLBACK_URL}
    />
  );
}