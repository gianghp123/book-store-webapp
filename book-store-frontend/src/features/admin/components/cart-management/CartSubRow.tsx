"use client";

import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { Badge } from "@/components/ui/badge";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { Row } from "@tanstack/react-table";
import { toast } from "sonner";

interface CartSubRowProps {
  row: Row<CartResponse>;
}

export function CartSubRow({ row }: CartSubRowProps) {
  const cart = row.original;

  const handleRemoveFromCart = (cartId: string, itemId: string) => {
    toast.success("Item removed from cart (simulation)");
  };

  return (
    <div className="p-4 bg-muted/50 rounded-md space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-600">User</p>
          <p className="font-medium">{cart.user.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Created At</p>
          <p className="font-medium">{new Date(cart.createdAt).toLocaleString()}</p>
        </div>
      </div>

      <div>
        <h3 className="mb-3 font-semibold">Cart Items ({cart.items.length})</h3>
        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 p-3 bg-gray-50 rounded-lg"
            >
              <ImageWithFallback
                src={
                  item.product.image ||
                  `https://covers.openlibrary.org/b/isbn/${item.product.isbn}-M.jpg`
                }
                alt={item.product.title}
                className="w-16 h-20 object-cover rounded"
                width={64}
                height={80}
              />
              <div className="flex-1">
                <p className="font-medium">{item.product.title}</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.product.authors?.map((a) => (
                    <Badge key={a.id} variant="outline" className="text-xs">
                      {a.name}
                    </Badge>
                  ))}
                  {item.product.categories?.map((c) => (
                    <Badge key={c.id} variant="secondary" className="text-xs">
                      {c.name}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <p className="font-medium">${(Number(item.product.price) || 0).toFixed(2)}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-xl font-bold">
            ${(Number(cart.total) || 0).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}