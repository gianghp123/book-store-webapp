"use client";
import { NavigationSidebar } from "@/features/admin/components/NavigationSidebar";
import { adminResources } from "@/lib/routes/route-resources";
import { dataProvider } from "@/provider/data-provider";
import { Refine } from "@refinedev/core";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      <div className="lg:pl-64 transition-all duration-300">
        <Refine dataProvider={dataProvider()} resources={adminResources}>
          {children}
        </Refine>
      </div>
      <Toaster />
    </div>
  );
}
