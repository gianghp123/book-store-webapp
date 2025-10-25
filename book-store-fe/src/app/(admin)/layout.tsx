import { NavigationSidebar } from "@/features/admin/components/NavigationSidebar";
import { Toaster } from "sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationSidebar/>
      <div className="lg:pl-64 transition-all duration-300">
        <main className="min-h-screen">{children}</main>
      </div>
      <Toaster />
    </div>
  );
}
