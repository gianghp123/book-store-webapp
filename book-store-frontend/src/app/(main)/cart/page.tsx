import { ShoppingCart1 } from "@/features/carts/components/Cart";
import { getCartAction } from "@/features/carts/actions/cart.actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const cartData = await getCartAction();

  return <ShoppingCart1 cartResponse={cartData.data} />;
}
