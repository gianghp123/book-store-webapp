"use client";

import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";

interface SubRowProps {
  row: Row<Order>;
}

export function OrderSubRow({ row }: SubRowProps) {
  const { orderDate, items, status, totalAmount, user } = row.original;

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "Completed":
      case "Success":
        return "bg-green-100 text-green-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 bg-muted/50 rounded-md">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
        <div className="space-y-3">
          <h4 className="font-semibold">Order details</h4>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User:</span>
              <span className="font-medium">{user.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order date:</span>
              <span className="font-medium">
                {format(new Date(orderDate), "dd/MM/yyyy")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total amount:</span>
              <span className="font-medium">
                ${Number(totalAmount).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge className={getStatusBadgeColor(status)}>{status}</Badge>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:col-span-2">
          <h4 className="font-semibold">Products ({items.length})</h4>
          <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-start gap-3">
                <div className="relative h-20 w-14 flex-shrink-0">
                  <ImageWithFallback
                    src={
                      item.product?.image ||
                      `https://covers.openlibrary.org/b/isbn/${item.product?.isbn}-S.jpg`
                    }
                    alt={item.product?.title || "Book cover"}
                    fill
                    className="object-contain rounded"
                  />
                </div>  
                <div className="flex-1">
                  <Link href={`/products/${item.product.id}`}>
                    <p className="font-medium text-sm line-clamp-2 hover:text-primary">
                      {item.product.title}
                    </p>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    Price: ${Number(item.price)}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.product.authors?.map((a) => (
                      <Badge key={a.id} variant="outline" className="text-xs">
                        {a.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}