"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown } from "lucide-react"; // <-- THÊM IMPORT
import { format } from "date-fns";
import { cn } from "@/lib/utils"; // <-- THÊM IMPORT

// *** THAY ĐỔI: Chuyển từ hàm getCartColumns thành hằng số cartColumns ***
export const cartColumns: ColumnDef<CartResponse>[] = [
  {
    accessorKey: "id",
    header: "Cart ID",
    cell: ({ row }) => (
      // *** THAY ĐỔI Ô NÀY ***
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={row.getToggleExpandedHandler()} // <-- Thêm handler
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              row.getIsExpanded() && "rotate-180" // Xoay icon
            )}
          />
        </Button>
        <span className="text-gray-500">
          #{row.original.id.substring(0, 8)}...
        </span>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div className="text-gray-500">{row.original.user.email}</div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <Badge variant="secondary">{row.original.items.length} items</Badge>
    ),
  },
  {
    accessorKey: "total",
    header: "Total Value",
    cell: ({ row }) => (
      <div>${(Number(row.original.total) || 0).toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.createdAt), "MM/dd/yyyy")}</div>
    ),
  },
  // *** XÓA CỘT "ACTIONS" CŨ (NÚT CON MẮT) ***
];