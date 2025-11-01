import { ShoppingCart1 } from "@/features/carts/components/Cart";
import { cartService } from "@/features/carts/services/cartService";
// Chuyển thành async function để fetch dữ liệu trên server
export default async function CartPage() {
  const response = await cartService.getCart();
  const cartData = response.data;

  return <ShoppingCart1 cartResponse={cartData} />;
}
