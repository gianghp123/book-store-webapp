"use client";
import { NavigationSidebar } from "@/features/admin/components/NavigationSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      <div className="lg:pl-64 transition-all duration-300">{children}</div>
    </div>
  );
}
