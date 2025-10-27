"use client";
import { authProvider } from "@/provider/auth-provider";
import { dataProvider } from "@/provider/data-provider";
import { queryClient } from "@/provider/react-query-provider";
import { Refine } from "@refinedev/core";
import { QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientProvider client={queryClient}>
          <Refine dataProvider={dataProvider()} authProvider={authProvider}>
            {children}
          </Refine>
        </QueryClientProvider>
        <Toaster />
      </body>
    </html>
  );
}
