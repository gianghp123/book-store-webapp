// Tệp cập nhật: src/features/orders/components/my-orders-columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button"; // <-- THÊM
import { ChevronDown } from "lucide-react"; // <-- THÊM
import { cn } from "@/lib/utils"; // <-- THÊM

// Bỏ hàm bao bọc (không cần props onViewDetails nữa)
export const myOrderColumns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      // *** THAY ĐỔI Ô NÀY ***
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6" // Làm cho nút nhỏ hơn
          onClick={row.getToggleExpandedHandler()} // Gọi hàm toggle của tanstack
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform",
              row.getIsExpanded() && "rotate-180" // Xoay mũi tên khi mở
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
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => (
      <div>{format(new Date(row.original.orderDate), "MM/dd/yyyy")}</div>
    ),
  },
  {
    accessorKey: "items",
    header: "Items",
    cell: ({ row }) => <div>{row.original.items.length} items</div>,
  },
  {
    accessorKey: "totalAmount",
    header: "Total Amount",
    // Cập nhật để luôn hiển thị 2 số thập phân
    cell: ({ row }) => <div>${Number(row.original.totalAmount).toFixed(2)}</div>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let badgeColor = "bg-gray-100 text-gray-700";

      switch (status) {
        case "Completed":
        case "Success": 
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

      return <Badge className={badgeColor}>{status}</Badge>;
    },
  },
];