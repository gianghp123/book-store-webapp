import {MainHeader} from "@/components/MainHeader";
import {MainFooter} from "@/components/MainFooter";
import { Toaster } from "@/components/ui/sonner";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <MainHeader />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <MainFooter />
      <Toaster />
    </div>
  );
}