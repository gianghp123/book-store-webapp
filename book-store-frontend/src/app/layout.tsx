'use client'
import { authProvider } from "@/provider/auth-provider";
import { dataProvider } from "@/provider/data-provider";
import { queryClient } from "@/provider/react-query-provider";
import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/nextjs-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Suspense } from "react";

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
        <Suspense>
          <QueryClientProvider client={queryClient}>
            <Refine
              dataProvider={{
                default: dataProvider(false),
                admin: dataProvider(true),
              }}
              authProvider={authProvider}
              routerProvider={routerProvider}
            >
              {children}
            </Refine>
          </QueryClientProvider>
        </Suspense>
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
