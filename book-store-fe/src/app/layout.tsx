"use client";
import { queryClient } from "@/provider/react-query-provider";
import { QueryClientProvider } from "@tanstack/react-query";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Refine } from "@refinedev/core";
import { dataProvider } from "@/provider/public-data-provider";
import { authProvider } from "@/provider/auth-provider";
import { resource } from "@/lib/routes/route-resources";

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
          <Refine
            dataProvider={dataProvider()}
            authProvider={authProvider}
            resources={resource}
          >
            {children}
          </Refine>
        </QueryClientProvider>
      </body>
    </html>
  );
}
