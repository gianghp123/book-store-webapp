"use client";
import { NavigationSidebar } from "@/features/admin/components/NavigationSidebar";
import { Role } from "@/lib/constants/enums";
import { Authenticated } from "@refinedev/core";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Authenticated key="admin" params={{ role: Role.ADMIN }}> 
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar />
      <div className="lg:pl-64 transition-all duration-300">{children}</div>
    </div>
    </Authenticated>
  );
}
