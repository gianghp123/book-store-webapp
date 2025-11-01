"use client";

import { Menu, Search, ShoppingCart, User, LayoutDashboard, BookMarked, Settings, LogOut,} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // Next.js 13+
import { SearchBar } from "../features/search-bar/components/SearchBar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useGetIdentity, useLogout } from "@refinedev/core";
import { UserResponse } from "@/features/users/dtos/response/user-response.dto";
import { Role } from "@/lib/constants/enums";
interface HeaderProps {
  cartItemsCount?: number;
  onMenuToggle?: () => void;
}

export function MainHeader({ cartItemsCount = 3, onMenuToggle }: HeaderProps) {
  const pathname = usePathname(); 

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
              <span className="text-primary-foreground font-bold">E</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">
              EliteStore
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
            { href: "/deals", label: "Deals" },
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
          <Button variant="ghost" size="sm" className="sm:hidden">
            <Search className="h-5 w-5" />
          </Button>
          <Link href="/cart" className="cursor-pointer">
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>
          </Link>
            <Button variant="ghost" size="sm">
              <User className="h-5 w-5" />
            </Button>
        </div>
      </div>
    </header>
  );
}
