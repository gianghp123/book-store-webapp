// src/app/(main)/payment/page.tsx
import { PaymentForm1 } from "@/features/orders/components/PaymentForm";
import { cartService } from "@/features/carts/services/cartService";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";

// Biến trang này thành một Server Component `async`
export default async function PaymentPage() {
  let cartData: CartResponse | undefined = undefined;
  const response = await cartService.getCart();

  if (response.success && response.data) {
    cartData = response.data;
  }

  // 2. Nếu không có giỏ hàng, hoặc giỏ hàng rỗng, quay lại trang /cart
  if (cartData?.items.length === 0) {
    cartData = undefined;
  }

  // 4. Truyền dữ liệu thật xuống component
  return <PaymentForm1 cartData={cartData} />;
}
