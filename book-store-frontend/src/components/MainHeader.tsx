"use client";

import { useCartItemsCount } from "@/features/carts/context/CartItemsCountContext";
import { useIsAuthenticated } from "@refinedev/core";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Next.js 13+
import { SearchBar } from "../features/search-bar/components/SearchBar";
import AvatarPopover from "./AvatarPopover";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export function MainHeader() {
  const pathname = usePathname();
  const { data: authenticated, isLoading } = useIsAuthenticated();
  const { cartItemsCount } = useCartItemsCount();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">BookHaven</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
            { href: "/about", label: "About" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition-colors ${
                isActive(href)
                  ? "text-gradient-purple-pink-strong" // always gradient
                  : "text-gradient-purple-pink-strong-hover" // only on hover
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
        <SearchBar />

        {/* Actions */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="flex items-center space-x-4">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </div>
          ) : authenticated?.authenticated ? (
            <>
              <Link href="/cart" className="cursor-pointer">
                <Button variant="ghost" size="sm" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                  >
                    {cartItemsCount}
                  </Badge>
                </Button>
              </Link>
              <AvatarPopover />
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  className="bg-gradient-to-r from-purple-600/80 to-pink-500/80 hover:bg-purple-700 text-white shadow-lg shadow-purple-400/40"
                  size="sm"
                >
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
