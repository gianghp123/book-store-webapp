"use client";

import { MainFooter } from "@/components/MainFooter";
import { MainHeader } from "@/components/MainHeader";
import { CartItemsCountProvider } from "@/features/carts/context/CartItemsCountContext";
import { Suspense } from "react";
import Loading from "./loading";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <CartItemsCountProvider>
        <MainHeader />
        <Suspense fallback={<Loading />}>
          <main className="min-h-screen container mx-auto px-4 py-6">{children}</main>
        </Suspense>
        <MainFooter />
      </CartItemsCountProvider>
    </div>
  );
}
