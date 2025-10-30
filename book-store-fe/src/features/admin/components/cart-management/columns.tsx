"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export const cartColumns: ColumnDef<CartResponse>[] = [
  {
    accessorKey: "id",
    header: "Cart ID",
    cell: ({ row }) => (
      <div className="text-gray-500">#{row.original.id}</div>
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
      <div>${row.original.total.toFixed(2)}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.createdAt), 'MM/dd/yyyy')}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const cart = row.original;
      
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Handle view details action
            console.log("View details for cart:", cart);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];