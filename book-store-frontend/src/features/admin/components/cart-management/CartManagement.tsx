"use client";
import { ImageWithFallback } from "@/components/ImageWithFallBack";
import { DataTable } from "@/components/reusable/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { CartResponse } from "@/features/carts/dtos/response/cart-response.dto";
import { HttpError, useTable } from "@refinedev/core";
import { Search, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cartColumns } from "./columns";

export function CartManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    setCurrentPage,
    currentPage,
  } = useTable<CartResponse, HttpError>({
    resource: "carts",
    dataProviderName: "admin",
    pagination: {
      pageSize: 10,
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCart, setSelectedCart] = useState<CartResponse | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (cart: CartResponse) => {
    setSelectedCart(cart);
    setIsDialogOpen(true);
  };

  const handleRemoveFromCart = (cartId: string, itemId: string) => {
    toast.success("Item removed from cart");
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Cart Management</h1>
          <p className="text-gray-600 mt-1">
            View and manage customer shopping carts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Carts</p>
                <div className="text-2xl mt-1">{result.total}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <div className="text-2xl mt-1">{result.total}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <div className="text-2xl mt-1">${result.total}</div>
              </div>
              <ShoppingCart className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search carts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={cartColumns}
            data={result.data}
            isLoading={tableQuery.isLoading}
            currentPage={currentPage}
            pageCount={pageCount}
            setCurrentPage={setCurrentPage}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Cart Details - #{selectedCart?.id}</DialogTitle>
          </DialogHeader>
          {selectedCart && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created At</p>
                  <p>{new Date(selectedCart.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Items</p>
                  <p>{selectedCart.items.length}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Cart Items</h3>
                <div className="space-y-3">
                  {selectedCart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-3 bg-gray-50 rounded-lg"
                    >
                      <ImageWithFallback
                        src={`https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=200`}
                        alt={item.product.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p>{item.product.title}</p>
                        {item.product.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {item.product.description}
                          </p>
                        )}
                        <div className="flex gap-2 mt-2">
                          {item.product.categories && item.product.categories.map((cat) => (
                            <Badge
                              key={cat.id}
                              variant="secondary"
                              className="text-xs"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          by{" "}
                          {item.product.authors && item.product.authors.map((a) => a.name).join(", ")}
                        </p>
                      </div>
                      <div className="flex flex-col items-end justify-between">
                        <p>${item.product.price || 0}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleRemoveFromCart(selectedCart.id, item.id)
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-xl">${selectedCart.total.toFixed(2)}</p>
                </div>
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
