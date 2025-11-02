"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Role } from "@/lib/constants/enums";
import { useGetIdentity } from "@refinedev/core";
import { ChartCandlestick, Settings, User, ShoppingBag } from "lucide-react"; 
import Link from "next/link";
import LogoutButton from "./LogoutButton";

const AvatarPopover = () => {
  const { data: identity, isLoading } = useGetIdentity();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full p-0">
          <User className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-3">
        <div className="flex items-center gap-3">
          <div className="text-sm">
            <p className="font-medium">{identity?.name?.toUpperCase()}</p>
            <p className="text-muted-foreground text-xs">{identity?.email}</p>
          </div>
        </div>
        <Separator className="my-3" />
        <div className="grid gap-1 text-sm">
          {!isLoading && identity?.role === Role.ADMIN && (
            <Link href="/admin/dashboard">
              <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent">
                <ChartCandlestick className="h-4 w-4" />
                Dashboard
              </button>
            </Link>
          )}
          <Link href="/profile">
            <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent">
              <User className="h-4 w-4" />
              Profile
            </button>
          </Link>

          <Link href="/my-orders">
            <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent">
              <ShoppingBag className="h-4 w-4" />
              Order management
            </button>
          </Link>

          <Link href="/settings">
            <button className="flex w-full items-center gap-2 rounded-md p-2 hover:bg-accent">
              <Settings className="h-4 w-4" />
              Settings
            </button>
          </Link>
          <LogoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AvatarPopover;