import { MyOrders } from "../../../features/orders/components/MyOrders";
import { Suspense } from "react";
import Loading from "../loading";

export default function MyOrdersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <MyOrders />
    </Suspense>
  );
}