"use client";

import { MainFooter } from "@/components/MainFooter";
import { MainHeader } from "@/components/MainHeader";
import { SearchContextProvider } from "@/features/search-bar/providers/SearchContextProvider";
import { Suspense } from "react";
import Loading from "./loading";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SearchContextProvider>
        <MainHeader />
        <Suspense fallback={<Loading />}>
          <main className="container mx-auto px-4 py-6">{children}</main>
        </Suspense>
        <MainFooter />
      </SearchContextProvider>
    </div>
  );
}
