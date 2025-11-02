// Tệp cập nhật: src/features/orders/components/MyOrders.tsx
"use client";
// *** THAY ĐỔI IMPORT ***
import { ExpandableDataTable } from "@/components/reusable/expandable-data-table";
// *** KẾT THÚC THAY ĐỔI ***

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Order } from "@/features/orders/dtos/response/order-response.dto";
import { Authenticated, HttpError, useTable } from "@refinedev/core";
import { myOrderColumns } from "./my-orders-columns";
import { MyOrdersSubRow } from "./MyOrdersSubRow";

export function MyOrders() {
  const { result, tableQuery, pageCount, currentPage, setCurrentPage } =
    useTable<Order, HttpError>({
      resource: "orders/me",
      dataProviderName: "admin",
      pagination: {
        pageSize: 10,
      },
      
      meta: {
        relations: ["items", "items.product", "items.product.book"],
      },
    });

  return (
    <Authenticated key="my-orders-page">
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Đơn hàng của tôi</h1>
            <p className="text-gray-600 mt-1">
              Xem lịch sử các đơn hàng bạn đã đặt.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Lịch sử đơn hàng</CardTitle>
          </CardHeader>
          <CardContent>
            {/* *** THAY ĐỔI TÊN COMPONENT *** */}
            <ExpandableDataTable
              columns={myOrderColumns}
              data={result?.data}
              pageCount={pageCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              isLoading={tableQuery.isLoading}
              getRowCanExpand={() => true}
              renderSubComponent={({ row }) => <MyOrdersSubRow row={row} />}
            />
            {/* *** KẾT THÚC THAY ĐỔI *** */}
          </CardContent>
        </Card>
      </div>
    </Authenticated>
  );
}