"use client";
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
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { HttpError, useTable } from "@refinedev/core";
import { DollarSign, Search, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { orderColumns } from "./columns";

export function OrderManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    currentPage,
    setCurrentPage,
  } = useTable<Order, HttpError>({
    resource: "orders/admin",
    // sorters: [
    //   {
    //     field: "createdAt",
    //     order: "desc",
    //   },
    // ],
    pagination: {
      pageSize: 10,
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const getStatusBadgeColor = (status: string) => {
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
    return badgeColor;
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <div className="text-2xl mt-1">{result.total}</div>
              </div>
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed Orders</p>
                <div className="text-2xl mt-1">
                  {
                    result.data?.filter((order) => order.status === "completed")
                      .length
                  }
                </div>
              </div>
              <ShoppingBag className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <div className="text-2xl mt-1">
                  $
                  {result.data
                    ?.reduce((total, order) => total + order.totalAmount, 0)
                    .toFixed(2)}
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
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
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={orderColumns}
            data={result.data}
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={tableQuery.isLoading}
          />
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Order Date</p>
                  <p>{new Date(selectedOrder.orderDate).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={getStatusBadgeColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p>{selectedOrder.user.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p>${selectedOrder.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p>{item.product.title}</p>
                        {item.product.description && (
                          <p className="text-sm text-gray-600">
                            {item.product.description}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p>${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
