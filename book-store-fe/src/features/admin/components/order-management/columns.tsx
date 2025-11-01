"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { format } from "date-fns";

export const orderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <div className="text-gray-500">#{row.original.id}</div>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => (
      <div>{row.original.user.email || row.original.user.phoneNumber}</div>
    ),
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => (
      <div>
        {format(new Date(row.original.orderDate), 'MM/dd/yyyy')}
      </div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => (
      <div>{row.original.items.length} items</div>
    ),
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    cell: ({ row }) => (
      <div>${row.original.totalAmount}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeColor = "bg-gray-100 text-gray-700";
      
      switch (status) {
        case "Completed":
          badgeColor = "bg-green-100 text-green-700";
          break;
        case "Processing":
          badgeColor = "bg-blue-100 text-blue-700";
          break;
        case "Shipped":
          badgeColor = "bg-orange-100 text-orange-700";
          break;
        case "Cancelled":
          badgeColor = "bg-red-100 text-red-700";
          break;
      }
      
      return (
        <Badge className={badgeColor}>
          {status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const order = row.original;
      
      return (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            // Handle view details action
            console.log("View details for order:", order);
          }}
        >
          <Eye className="h-4 w-4" />
        </Button>
      );
    },
  },
];