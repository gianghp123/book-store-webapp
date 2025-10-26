"use client";

import {MainHeader} from "@/components/MainHeader";
import {MainFooter} from "@/components/MainFooter";
import { Toaster } from "@/components/ui/sonner";
import { Refine } from "@refinedev/core";
import { dataProvider } from "@/provider/public-data-provider";
import { resource } from "@/lib/routes/route-resources";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <Refine
        dataProvider={dataProvider()}
        resources={resource}
      >
     
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
       </Refine>
      <MainFooter />
      <Toaster />
    </div>
  );
}