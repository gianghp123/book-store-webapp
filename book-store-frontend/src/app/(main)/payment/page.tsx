import { PaymentForm1 } from "@/features/orders/components/PaymentForm";
import { getCartAction } from "@/features/carts/actions/cart.actions";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";

export default async function PaymentPage() {
  let cartData: CartResponse | undefined = undefined;
  const response = await getCartAction();

  if (response.success && response.data) {
    cartData = response.data;
  }

  if (cartData?.items.length === 0) {
    cartData = undefined;
  }
  return <PaymentForm1 cartData={cartData} />;
}
