import { ShoppingCart1 } from "@/features/carts/components/Cart";
import { getCartAction } from "@/features/carts/actions/cart.actions";

async function fetchCart() {
  const response = await getCartAction();
  return response.data;
}

export default async function CartPage() {
  const cartData = await fetchCart();

  return <ShoppingCart1 cartResponse={cartData} />;
}
