// src/app/(auth)/layout.tsx (SAU KHI SỬA)
import { Toaster } from "@/components/ui/sonner" //
import { AuthProvider } from "./auth-provider" // Import provider bạn vừa tạo

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      {children}
      
      <Toaster />
    </AuthProvider>
  )
}