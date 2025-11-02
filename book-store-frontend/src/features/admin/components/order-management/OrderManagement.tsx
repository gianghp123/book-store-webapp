"use client";
// *** THAY ĐỔI IMPORT DATATABLE ***
import { ExpandableDataTable } from "@/components/reusable/expandable-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
// *** XÓA IMPORT DIALOG ***
import { Input } from "@/components/ui/input";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { HttpError, useTable } from "@refinedev/core";
import { DollarSign, Search, ShoppingBag } from "lucide-react";
import { useState } from "react"; // Xóa 'useMemo' nếu không dùng
import { orderColumns } from "./columns";
// *** THÊM IMPORT SUBROW ***
import { OrderSubRow } from "./OrderSubRow";

export function OrderManagement() {
  const {
    result,
    tableQuery,
    pageCount,
    currentPage,
    setCurrentPage,
  } = useTable<Order, HttpError>({
    resource: "orders",
    dataProviderName: "admin",
    pagination: {
      pageSize: 10,
    },
    // *** THÊM META ĐỂ ĐẢM BẢO LOAD ĐÚNG (DỰ PHÒNG) ***
    meta: {
      relations: [
        "items",
        "items.product",
        "user",
        "items.product.book",
        "items.product.book.categories",
        "items.product.book.authors",
      ],
    },
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // *** XÓA BỎ STATE VÀ HÀM CỦA DIALOG ***
  // const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const handleViewDetails = (order: Order) => { ... };
  // const getStatusBadgeColor = (status: string) => { ... };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Order Management</h1>
          <p className="text-gray-600 mt-1">Track and manage customer orders</p>
        </div>
      </div>

      {/* ... (Các thẻ thống kê Card giữ nguyên) ... */}
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
                    result.data?.filter(
                      (order) =>
                        order.status === "Completed" || order.status === "Success"
                    ).length
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
                    ?.reduce((total, order) => total + (Number(order.totalAmount) || 0), 0)
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
          {/* *** THAY THẾ DATATABLE BẰNG EXPANDABLEDATATABLE *** */}
          <ExpandableDataTable
            columns={orderColumns} // columns.tsx đã được cập nhật
            data={result.data}
            pageCount={pageCount}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            isLoading={tableQuery.isLoading}
            // Thêm 2 props quan trọng này
            getRowCanExpand={() => true}
            renderSubComponent={({ row }) => <OrderSubRow row={row} />}
          />
        </CardContent>
      </Card>

      {/* *** XÓA BỎ TOÀN BỘ COMPONENT <Dialog> CŨ *** */}
    </div>
  );
}